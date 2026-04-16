# 🧠 ALGORITHMS.md — Core Algorithms & Logic

## 1. Hybrid Search Algorithm

Combines keyword (BM25) and semantic (vector) search with Reciprocal Rank Fusion:

```typescript
// packages/search/hybrid-search.ts

interface SearchResult {
  productId: string;
  score: number;
  rank: number;
}

/**
 * Reciprocal Rank Fusion (RRF)
 * Combines multiple ranked lists without needing score normalization
 * Score = Σ 1 / (k + rank_i) where k=60 (standard constant)
 */
function reciprocalRankFusion(
  keywordResults: SearchResult[],
  semanticResults: SearchResult[],
  k = 60
): SearchResult[] {
  const scoreMap = new Map<string, number>();

  const addRanks = (results: SearchResult[], weight: number) => {
    results.forEach((r, index) => {
      const rrf = weight * (1 / (k + index + 1));
      scoreMap.set(r.productId, (scoreMap.get(r.productId) ?? 0) + rrf);
    });
  };

  addRanks(keywordResults, 0.6);   // BM25 weight
  addRanks(semanticResults, 0.4);  // Vector weight

  return Array.from(scoreMap.entries())
    .map(([productId, score]) => ({ productId, score, rank: 0 }))
    .sort((a, b) => b.score - a.score)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

/**
 * Personalization Boosting
 * Adjusts scores based on user behavior signals
 */
function personalizeResults(
  results: SearchResult[],
  userSignals: UserSignals
): SearchResult[] {
  return results.map(r => {
    let boost = 1.0;

    // Boost previously viewed categories
    if (userSignals.viewedCategories.includes(r.category)) boost *= 1.15;
    // Boost items in price range preference
    if (r.price <= userSignals.avgOrderValue * 1.2) boost *= 1.1;
    // Boost brands user has purchased
    if (userSignals.purchasedBrands.includes(r.brand)) boost *= 1.25;
    // Penalize out-of-stock
    if (r.stock === 0) boost *= 0.1;

    return { ...r, score: r.score * boost };
  }).sort((a, b) => b.score - a.score);
}
```

---

## 2. Dynamic Pricing Engine

```typescript
// services/pricing/engine.ts

interface PricingContext {
  basePrice: number;
  cost: number;
  inventory: number;
  reorderPoint: number;
  demandVelocity: number;     // units sold per day (7-day avg)
  competitorPrice?: number;
  customerSegment: 'retail' | 'wholesale' | 'vip';
  timeOfDay: number;          // 0-23
  dayOfWeek: number;          // 0-6
  isFlashSale: boolean;
}

interface PricingResult {
  finalPrice: number;
  appliedRules: string[];
  marginPercent: number;
}

class DynamicPricingEngine {
  
  calculate(ctx: PricingContext, rules: PricingRule[]): PricingResult {
    let price = ctx.basePrice;
    const appliedRules: string[] = [];

    // Sort rules by priority
    const sortedRules = rules.sort((a, b) => b.priority - a.priority);

    for (const rule of sortedRules) {
      if (this.evaluateCondition(rule.condition, ctx)) {
        price = this.applyModifier(price, rule.modifier);
        appliedRules.push(rule.name);
        if (rule.stopProcessing) break;
      }
    }

    // Hard floor: never sell below cost + minimum margin
    const minimumPrice = ctx.cost * 1.05; // 5% minimum margin
    price = Math.max(price, minimumPrice);

    // Round to psychological pricing (.99, .95, .00)
    price = this.psychologicalRound(price);

    return {
      finalPrice: price,
      appliedRules,
      marginPercent: ((price - ctx.cost) / price) * 100
    };
  }

  private psychologicalRound(price: number): number {
    if (price >= 100) return Math.round(price) - 0.01;
    if (price >= 10)  return Math.floor(price) + 0.99;
    return Math.round(price * 10) / 10 - 0.01;
  }
}

// Built-in pricing rules
const STOCK_SCARCITY_RULE: PricingRule = {
  name: 'stock_scarcity',
  priority: 80,
  condition: (ctx) => ctx.inventory < ctx.reorderPoint * 0.5,
  modifier: { type: 'multiply', value: 1.08 }, // +8% when low stock
  stopProcessing: false,
};

const HIGH_DEMAND_RULE: PricingRule = {
  name: 'high_demand',
  priority: 70,
  condition: (ctx) => ctx.demandVelocity > ctx.historicalAvgVelocity * 2,
  modifier: { type: 'multiply', value: 1.12 }, // +12% on demand surge
  stopProcessing: false,
};
```

---

## 3. Discount Engine & Stacking Logic

```typescript
// services/promotions/discount-engine.ts

/**
 * Discount Priority & Stacking Algorithm
 * Rules: 
 *   1. Only one automatic discount applies (highest value)
 *   2. Coupon codes stack with automatic discounts
 *   3. Discount type precedence: fixed > percentage > shipping
 *   4. Line-item discounts apply before order-level discounts
 */

interface DiscountApplication {
  lineItems: LineItem[];
  appliedCoupons: Coupon[];
  activePromotions: Promotion[];
}

class DiscountEngine {
  
  apply(cart: Cart, context: DiscountApplication): CartWithDiscounts {
    // Step 1: Apply line-item level automatic promotions
    let items = this.applyLineItemDiscounts(
      cart.items, 
      context.activePromotions.filter(p => p.scope === 'line_item')
    );

    // Step 2: Apply BOGO rules
    items = this.applyBOGORules(items, context.activePromotions);

    // Step 3: Calculate subtotal after line discounts
    const subtotal = items.reduce((sum, i) => sum + i.finalPrice * i.qty, 0);

    // Step 4: Apply order-level promotions (take best one only)
    const orderPromos = context.activePromotions
      .filter(p => p.scope === 'order' && p.type === 'auto')
      .filter(p => this.meetsMinimum(subtotal, p))
      .sort((a, b) => this.calculateSaving(b, subtotal) - this.calculateSaving(a, subtotal));

    let orderDiscount = 0;
    const bestOrderPromo = orderPromos[0];
    if (bestOrderPromo) {
      orderDiscount = this.calculateSaving(bestOrderPromo, subtotal);
    }

    // Step 5: Apply coupon codes (stackable, up to merchant config limit)
    let couponDiscount = 0;
    for (const coupon of context.appliedCoupons) {
      if (this.validateCoupon(coupon, cart, subtotal)) {
        couponDiscount += this.calculateSaving(coupon, subtotal - couponDiscount);
      }
    }

    // Step 6: Apply free shipping
    const shippingDiscount = this.calculateShippingDiscount(
      cart.shippingCost, 
      context.activePromotions, 
      subtotal - orderDiscount - couponDiscount
    );

    return {
      ...cart,
      items,
      discounts: {
        lineItem: items.reduce((s, i) => s + (i.originalPrice - i.finalPrice) * i.qty, 0),
        order: orderDiscount,
        coupon: couponDiscount,
        shipping: shippingDiscount,
        total: orderDiscount + couponDiscount + shippingDiscount
      },
      total: subtotal - orderDiscount - couponDiscount + cart.shippingCost - shippingDiscount
    };
  }

  private applyBOGORules(items: LineItem[], promos: Promotion[]): LineItem[] {
    const bogoPromos = promos.filter(p => p.type === 'bogo');
    // BOGO: Sort qualifying items by price DESC, give cheapest free
    for (const promo of bogoPromos) {
      const qualifying = items
        .filter(i => promo.qualifyingSkus.includes(i.sku))
        .sort((a, b) => b.finalPrice - a.finalPrice);
      
      const paidCount = Math.floor(qualifying.length / (promo.buyQty + promo.getQty)) * promo.buyQty;
      const freeCount = qualifying.length - paidCount;
      
      // Zero out cheapest N items
      qualifying.slice(-freeCount).forEach(i => { i.finalPrice = 0; });
    }
    return items;
  }
}
```

---

## 4. Inventory Reservation Algorithm (Oversell Prevention)

```typescript
// services/inventory/reservation.ts

/**
 * Two-phase inventory reservation using Redis atomic operations
 * Prevents overselling in high-concurrency scenarios
 */

class InventoryReservationService {
  
  /**
   * Phase 1: Reserve (hold stock during checkout)
   * Atomic DECRBY in Redis with Lua script for compare-and-swap
   */
  async reserve(items: CartItem[], sessionId: string, ttlSeconds = 600): Promise<ReservationResult> {
    const reservationId = ulid();
    
    const luaScript = `
      local results = {}
      for i = 1, #KEYS do
        local available = tonumber(redis.call('GET', KEYS[i]))
        local requested = tonumber(ARGV[i])
        if available == nil or available < requested then
          -- Rollback all previous decrements
          for j = 1, i - 1 do
            redis.call('INCRBY', KEYS[j], ARGV[j])
          end
          return {-1, i}  -- Failed at item i
        end
        redis.call('DECRBY', KEYS[i], requested)
        results[i] = available - requested
      end
      return results
    `;

    const keys = items.map(i => `inventory:available:${i.variantId}`);
    const quantities = items.map(i => i.quantity);

    const result = await redis.eval(luaScript, keys, quantities);
    
    if (result[0] === -1) {
      throw new InsufficientStockError(items[result[1] - 1]);
    }

    // Store reservation with TTL
    await redis.setex(
      `reservation:${reservationId}`,
      ttlSeconds,
      JSON.stringify({ items, sessionId, createdAt: Date.now() })
    );

    return { reservationId, expiresAt: Date.now() + ttlSeconds * 1000 };
  }

  /**
   * Phase 2a: Confirm — decrement permanent inventory, release reservation
   */
  async confirm(reservationId: string, orderId: string): Promise<void> {
    const reservation = await this.getReservation(reservationId);
    
    // Write to permanent DB (deducted from committed inventory)
    await db.transaction(async (tx) => {
      for (const item of reservation.items) {
        await tx.update(inventory)
          .set({ committed: sql`committed + ${item.quantity}` })
          .where(eq(inventory.variantId, item.variantId));
      }
      await tx.insert(inventoryTransactions).values(
        reservation.items.map(item => ({
          variantId: item.variantId,
          type: 'sale',
          qty: -item.quantity,
          orderId,
          reservationId,
        }))
      );
    });

    await redis.del(`reservation:${reservationId}`);
  }

  /**
   * Phase 2b: Release — restore Redis inventory (timeout or cancellation)
   */
  async release(reservationId: string): Promise<void> {
    const reservation = await this.getReservation(reservationId);
    if (!reservation) return; // Already expired/released

    const pipeline = redis.pipeline();
    for (const item of reservation.items) {
      pipeline.incrby(`inventory:available:${item.variantId}`, item.quantity);
    }
    pipeline.del(`reservation:${reservationId}`);
    await pipeline.exec();
  }
}
```

---

## 5. Order Routing Algorithm (Multi-Warehouse)

```typescript
// services/fulfillment/order-router.ts

/**
 * Optimal warehouse selection using weighted scoring
 * Factors: proximity, stock availability, fulfillment capacity, cost
 */

class OrderRouter {
  
  async route(order: Order): Promise<FulfillmentPlan> {
    const warehouses = await this.getActiveWarehouses(order.tenantId);
    const customerLocation = await this.geocode(order.shippingAddress);

    // Score each warehouse for each line item
    const plans = await this.generatePlans(order.items, warehouses, customerLocation);

    // Find optimal split-fulfillment plan
    return this.optimizePlan(plans, order);
  }

  private scoreWarehouse(
    warehouse: Warehouse,
    item: OrderItem,
    destination: LatLng
  ): number {
    let score = 0;

    // 1. Stock availability (weight: 40%)
    const stockRatio = Math.min(warehouse.stock[item.variantId] / item.quantity, 1);
    score += stockRatio * 40;

    // 2. Distance (weight: 30%) — lower is better
    const distance = haversineDistance(warehouse.location, destination);
    const distanceScore = Math.max(0, 30 - (distance / 100)); // -1 per 100km
    score += distanceScore;

    // 3. Fulfillment capacity (weight: 20%)
    const capacityRatio = 1 - (warehouse.pendingOrders / warehouse.maxCapacity);
    score += capacityRatio * 20;

    // 4. Shipping cost (weight: 10%)
    const shippingCost = this.estimateShippingCost(warehouse, destination, item);
    const costScore = Math.max(0, 10 - (shippingCost / 10));
    score += costScore;

    return score;
  }

  /**
   * Greedy algorithm for split-fulfillment optimization
   * NP-hard in general, greedy gives good-enough results in O(n*m)
   */
  private optimizePlan(itemScores: ItemWarehouseScore[][], order: Order): FulfillmentPlan {
    const assignments: Map<string, string> = new Map(); // itemId → warehouseId
    const warehouseLoad: Map<string, number> = new Map();

    for (const scores of itemScores) {
      // Pick highest-scoring warehouse that has full stock
      const sorted = scores.sort((a, b) => b.score - a.score);
      const best = sorted.find(s => s.hasFullStock) ?? sorted[0];
      assignments.set(best.itemId, best.warehouseId);
    }

    // Group into shipments by warehouse
    const shipments = this.groupIntoShipments(assignments, order);
    
    return { shipments, estimatedDelivery: this.calculateEDD(shipments) };
  }
}

// Haversine distance formula
function haversineDistance(a: LatLng, b: LatLng): number {
  const R = 6371; // Earth radius km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const h = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
```

---

## 6. Product Recommendation Engine

```typescript
// services/recommendations/engine.ts

/**
 * Collaborative Filtering (Item-Item)
 * "Customers who bought X also bought Y"
 * Uses cosine similarity on purchase co-occurrence matrix
 */

class RecommendationEngine {

  /**
   * Build item-item similarity matrix from order history
   * Runs as scheduled batch job (every 6 hours)
   */
  async buildSimilarityMatrix(tenantId: string): Promise<void> {
    // Fetch co-occurrence counts from ClickHouse
    const coOccurrences = await clickhouse.query(`
      SELECT 
        a.product_id as product_a,
        b.product_id as product_b,
        COUNT(DISTINCT a.order_id) as co_count
      FROM order_items a
      JOIN order_items b ON a.order_id = b.order_id AND a.product_id < b.product_id
      WHERE a.tenant_id = '${tenantId}'
        AND a.created_at > now() - INTERVAL 90 DAY
      GROUP BY product_a, product_b
      HAVING co_count >= 3
    `);

    // Calculate cosine similarity
    const productCounts = await this.getProductPurchaseCounts(tenantId);
    
    const similarities = coOccurrences.map(row => ({
      productA: row.product_a,
      productB: row.product_b,
      similarity: row.co_count / Math.sqrt(
        productCounts[row.product_a] * productCounts[row.product_b]
      )
    }));

    // Store top-K similar items per product in Redis
    const pipeline = redis.pipeline();
    const grouped = groupBy(similarities, 'productA');
    
    for (const [productId, sims] of Object.entries(grouped)) {
      const topK = sims.sort((a, b) => b.similarity - a.similarity).slice(0, 20);
      pipeline.zadd(
        `rec:similar:${tenantId}:${productId}`,
        ...topK.flatMap(s => [s.similarity, s.productB])
      );
      pipeline.expire(`rec:similar:${tenantId}:${productId}`, 86400 * 7);
    }
    await pipeline.exec();
  }

  /**
   * Get recommendations for a product (real-time)
   */
  async getSimilarProducts(tenantId: string, productId: string, limit = 8): Promise<string[]> {
    const cached = await redis.zrevrange(
      `rec:similar:${tenantId}:${productId}`, 0, limit - 1
    );
    
    if (cached.length > 0) return cached;
    
    // Fallback: same category, sort by popularity
    return this.getCategoryFallback(tenantId, productId, limit);
  }

  /**
   * Personalized homepage recommendations (session-based)
   */
  async getPersonalized(tenantId: string, userId: string, limit = 20): Promise<string[]> {
    const recentlyViewed = await this.getRecentlyViewed(userId);
    const purchaseHistory = await this.getPurchaseHistory(userId);

    // Aggregate similar items for all seed items
    const candidateScores = new Map<string, number>();
    
    for (const seedProduct of [...recentlyViewed, ...purchaseHistory]) {
      const similar = await redis.zrevrangebyscore(
        `rec:similar:${tenantId}:${seedProduct}`, '+inf', 0, 'LIMIT', 0, 50
      );
      similar.forEach((id, rank) => {
        const decay = 1 / (rank + 1); // Position decay
        candidateScores.set(id, (candidateScores.get(id) ?? 0) + decay);
      });
    }

    // Exclude already purchased / viewed
    const exclude = new Set([...recentlyViewed, ...purchaseHistory]);
    
    return Array.from(candidateScores.entries())
      .filter(([id]) => !exclude.has(id))
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);
  }
}
```

---

## 7. RFM Customer Segmentation

```typescript
// services/customers/rfm-segmentation.ts

/**
 * Recency-Frequency-Monetary (RFM) Analysis
 * Segments customers into 11 categories for targeted marketing
 */

interface RFMScore { r: number; f: number; m: number; } // 1-5 each

const RFM_SEGMENTS: Record<string, { label: string; description: string; minScore: string }> = {
  'Champions':          { label: '🏆 Champions', description: 'Bought recently, buy often, spend most', minScore: '555' },
  'LoyalCustomers':     { label: '💛 Loyal', description: 'Buy regularly, good spenders', minScore: '334' },
  'PotentialLoyalists': { label: '🌟 Potential Loyalists', description: 'Recent, paid well', minScore: '412' },
  'AtRisk':             { label: '⚠️ At Risk', description: 'Were champions, haven\'t bought recently', minScore: '241' },
  'CantLoseThemSoon':   { label: '🆘 Can\'t Lose', description: 'Big spenders gone inactive', minScore: '151' },
  'Hibernating':        { label: '😴 Hibernating', description: 'Low RFM, long time ago', minScore: '111' },
};

class RFMEngine {
  async segment(tenantId: string): Promise<void> {
    const customers = await db.query.customers.findMany({
      where: eq(customers.tenantId, tenantId),
      with: { orders: { columns: { createdAt: true, total: true } } }
    });

    const scored = customers.map(customer => {
      const now = Date.now();
      const orders = customer.orders.filter(o => o.status === 'completed');
      
      const recency = orders.length > 0
        ? (now - new Date(orders.at(-1)!.createdAt).getTime()) / 86400000 // days
        : 999;
      
      const frequency = orders.length;
      const monetary = orders.reduce((s, o) => s + o.total, 0) / Math.max(frequency, 1);

      return { customerId: customer.id, recency, frequency, monetary };
    });

    // Calculate quintile breakpoints
    const rBreaks = this.quintileBreaks(scored.map(s => s.recency).sort((a,b) => b-a));
    const fBreaks = this.quintileBreaks(scored.map(s => s.frequency).sort((a,b) => a-b));
    const mBreaks = this.quintileBreaks(scored.map(s => s.monetary).sort((a,b) => a-b));

    // Score each customer 1-5
    const rfmScores = scored.map(s => ({
      customerId: s.customerId,
      r: this.quintileScore(s.recency, rBreaks, true),  // lower recency = higher score
      f: this.quintileScore(s.frequency, fBreaks, false),
      m: this.quintileScore(s.monetary, mBreaks, false),
    }));

    // Assign segments & update DB
    const segmented = rfmScores.map(s => ({
      ...s,
      segment: this.assignSegment(s),
      rfmScore: `${s.r}${s.f}${s.m}`
    }));

    await db.insert(customerSegments).values(segmented).onConflictDoUpdate({
      target: customerSegments.customerId,
      set: { r: sql`excluded.r`, f: sql`excluded.f`, m: sql`excluded.m`, segment: sql`excluded.segment` }
    });
  }

  private quintileBreaks(sorted: number[]): number[] {
    const n = sorted.length;
    return [0.2, 0.4, 0.6, 0.8].map(p => sorted[Math.floor(p * n)]);
  }
}
```

---

## 8. POS Offline Sync (CRDT Conflict Resolution)

```typescript
// apps/pos/lib/sync/conflict-resolver.ts

/**
 * Conflict resolution for offline POS transactions
 * Strategy: Server wins for prices/inventory, client generates IDs
 */

class ConflictResolver {
  
  resolve(serverState: InventoryState, clientOps: PendingOperation[]): ResolvedOps {
    const resolved: ResolvedOps = { toApply: [], toDiscard: [], conflicts: [] };

    for (const op of clientOps.sort((a, b) => a.timestamp - b.timestamp)) {
      switch (op.type) {
        case 'sale':
          // Check if inventory still sufficient (server is source of truth)
          if (serverState.available[op.variantId] >= op.quantity) {
            resolved.toApply.push(op);
            serverState.available[op.variantId] -= op.quantity;
          } else if (serverState.available[op.variantId] > 0) {
            // Partial fulfillment — apply available quantity
            const partialOp = { ...op, quantity: serverState.available[op.variantId] };
            resolved.toApply.push(partialOp);
            resolved.conflicts.push({ op, type: 'partial', resolvedQty: partialOp.quantity });
            serverState.available[op.variantId] = 0;
          } else {
            resolved.toDiscard.push(op);
            resolved.conflicts.push({ op, type: 'out_of_stock' });
          }
          break;

        case 'price_override':
          // Server price might have changed — validate against server
          const serverPrice = serverState.prices[op.variantId];
          if (Math.abs(op.price - serverPrice) / serverPrice > 0.5) {
            // >50% difference — suspicious, flag for review
            resolved.conflicts.push({ op, type: 'price_mismatch', serverPrice });
          }
          resolved.toApply.push({ ...op, price: op.price }); // Allow POS override within limits
          break;
      }
    }

    return resolved;
  }
}
```

---

## 9. Tenant Provisioning Algorithm

```typescript
// services/tenants/provisioning.ts

/**
 * Automated tenant provisioning pipeline
 * Creates: DB schema, search collection, S3 bucket prefix, Redis namespace
 */

class TenantProvisioningService {
  
  async provision(tenantData: NewTenantInput): Promise<Tenant> {
    const tenantId = ulid();
    const slug = slugify(tenantData.storeName);

    // Step-by-step provisioning with rollback on failure
    const steps: ProvisioningStep[] = [
      {
        name: 'create_db_schema',
        execute: () => this.createDatabaseSchema(tenantId),
        rollback: () => this.dropDatabaseSchema(tenantId),
      },
      {
        name: 'run_migrations', 
        execute: () => this.runMigrations(tenantId),
        rollback: () => {}, // Schema drop handles this
      },
      {
        name: 'seed_defaults',
        execute: () => this.seedDefaultData(tenantId, tenantData),
        rollback: () => {},
      },
      {
        name: 'create_search_collection',
        execute: () => this.createTypesenseCollection(tenantId),
        rollback: () => this.deleteTypesenseCollection(tenantId),
      },
      {
        name: 'configure_redis_namespace',
        execute: () => this.initRedisNamespace(tenantId),
        rollback: () => this.flushRedisNamespace(tenantId),
      },
      {
        name: 'create_storefront_deployment',
        execute: () => this.deployStorefront(tenantId, slug),
        rollback: () => this.teardownStorefront(tenantId),
      },
    ];

    const completed: ProvisioningStep[] = [];
    
    try {
      for (const step of steps) {
        await step.execute();
        completed.push(step);
        await this.updateProvisioningStatus(tenantId, step.name, 'completed');
      }
    } catch (error) {
      // Rollback in reverse order
      for (const step of completed.reverse()) {
        await step.rollback().catch(e => console.error(`Rollback failed: ${step.name}`, e));
      }
      throw new ProvisioningError(tenantId, error);
    }

    return this.createTenantRecord(tenantId, slug, tenantData);
  }

  private async createDatabaseSchema(tenantId: string): Promise<void> {
    await db.execute(sql`CREATE SCHEMA IF NOT EXISTS ${sql.identifier(`tenant_${tenantId}`)}`);
    await db.execute(sql`
      GRANT USAGE ON SCHEMA ${sql.identifier(`tenant_${tenantId}`)} TO themrktplace_app;
      GRANT ALL ON ALL TABLES IN SCHEMA ${sql.identifier(`tenant_${tenantId}`)} TO themrktplace_app;
    `);
  }
}
```