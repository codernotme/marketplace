import Dexie, { type Table } from 'dexie'

export interface LocalOrder {
  id?: number
  orderId: string
  items: any[]
  total: number
  customer?: string
  createdAt: number
  synced: boolean
}

export class PosDatabase extends Dexie {
  orders!: Table<LocalOrder>

  constructor() {
    super('PosDatabase')
    this.version(1).stores({
      orders: '++id, orderId, synced, createdAt'
    })
  }

  async saveOrder(order: Omit<LocalOrder, 'id' | 'synced' | 'createdAt'>) {
    return await this.orders.add({
      ...order,
      createdAt: Date.now(),
      synced: false
    })
  }

  async getUnsyncedOrders() {
    return await this.orders.where('synced').equals(0).toArray() // 0 for false in IndexedDB index
  }

  async markAsSynced(id: number) {
    return await this.orders.update(id, { synced: true })
  }
}

export const db = new PosDatabase()
