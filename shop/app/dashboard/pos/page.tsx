"use client";

import { useState, useEffect } from "react";
import { 
  Button, 
  Card, 
  Input, 
  Badge,
  Modal,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { createOrder, fetchProducts } from "@/lib/api";
import { toast } from "sonner";

export default function POSPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetchProducts({ status: "active" });
      setProducts(res.data || []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item._id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const calculateSubtotal = () => cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const calculateTax = () => calculateSubtotal() * 0.08; 
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item._id,
          name: item.title || item.name,
          quantity: item.quantity,
          price: Number(item.price),
          subtotal: Number(item.price) * item.quantity
        })),
        pricing: {
          subtotal: calculateSubtotal(),
          tax_total: calculateTax(),
          grand_total: calculateTotal()
        },
        payment_method: paymentMethod,
        source: "pos",
        customer_email: customerEmail,
        customer_name: customerName
      };

      await createOrder(orderData);
      toast.success("Order processed and bill sent");
      setShowSuccess(true);
    } catch (error) {
      toast.error("Checkout failed. Check backend connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = products.filter(p => 
    (p.title || p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 p-2">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-3 relative">
          <Input 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <Icon icon="solar:magnifer-bold-duotone" className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-zinc-500 pointer-events-none" />
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Icon icon="solar:refresh-bold-duotone" className="text-4xl animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {filteredProducts.map(product => (
              <Card 
                key={product._id} 
                className="luxury-card cursor-pointer group hover:scale-[1.02] transition-all bg-zinc-900 border-white/5"
              >
                <div onClick={() => addToCart(product)}>
                  <div className="relative aspect-square overflow-hidden rounded-t-xl bg-zinc-800">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.title} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <Icon icon="solar:gallery-bold-duotone" className="text-4xl" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2">
                      <div className="px-2 py-1 bg-black/60 backdrop-blur-md text-[10px] font-black uppercase text-white rounded-lg border border-white/10">
                        {product.stock || 0} in stock
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold truncate text-white">{product.title || product.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-emerald-400 font-black tracking-tighter">${(Number(product.price) || 0).toFixed(2)}</p>
                      <Icon icon="solar:add-circle-bold-duotone" className="text-xl text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cart Area */}
      <div className="w-[400px] flex flex-col gap-4">
        <Card className="flex-1 luxury-card bg-zinc-900 border-white/5 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center justify-between text-white">
              Order Details
              <div className="w-6 h-6 rounded-full bg-primary text-[10px] flex items-center justify-center text-white">
                {cart.length}
              </div>
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
                <Icon icon="solar:cart-large-bold-duotone" className="text-6xl opacity-20" />
                <p className="font-bold uppercase tracking-wider text-xs opacity-40">Cart Terminal Empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item._id} className="flex justify-between items-center gap-3 animate-in fade-in slide-in-from-right-2">
                  <div className="flex-1">
                    <p className="text-xs font-black uppercase tracking-tight text-white line-clamp-1">{item.title || item.name}</p>
                    <p className="text-[10px] font-bold text-zinc-500 tracking-widest">${Number(item.price).toFixed(2)} EA</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button isIconOnly size="sm" variant="outline" className="border-white/10" onPress={() => updateQuantity(item._id, -1)}>
                      <Icon icon="solar:minus-circle-bold-duotone" />
                    </Button>
                    <span className="text-xs font-black text-white w-4 text-center">{item.quantity}</span>
                    <Button isIconOnly size="sm" variant="outline" className="border-white/10" onPress={() => updateQuantity(item._id, 1)}>
                      <Icon icon="solar:add-circle-bold-duotone" />
                    </Button>
                    <Button isIconOnly size="sm" variant="ghost" className="text-danger hover:bg-danger/10" onPress={() => removeFromCart(item._id)}>
                      <Icon icon="solar:trash-bin-trash-bold-duotone" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-white/[0.02] border-t border-white/5 flex flex-col gap-5">
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Customer Intelligence</p>
              <div className="relative">
                <Input 
                  placeholder="Full Name" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <Icon icon="solar:user-bold-duotone" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
              </div>
              <div className="relative">
                <Input 
                  placeholder="Digital Mail (for billing)" 
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
                 <Icon icon="solar:letter-bold-duotone" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500 font-bold uppercase tracking-widest">Subtotal</span>
                <span className="text-white font-black">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500 font-bold uppercase tracking-widest">Fiscal Tax</span>
                <span className="text-white font-black">${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-black mt-4 pt-4 border-t border-white/5">
                <span className="text-white uppercase tracking-tighter">Total</span>
                <span className="text-primary">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment & Action */}
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            {[ 
              { id: "cash", label: "Cash", icon: "solar:banknote-bold-duotone" },
              { id: "card", label: "Card", icon: "solar:card-bold-duotone" },
              { id: "qr", label: "QR Pay", icon: "solar:qr-code-bold-duotone" }
            ].map(method => (
              <Button 
                key={method.id}
                variant={paymentMethod === method.id ? "primary" : "outline"}
                className={`flex flex-col h-16 transition-all border-white/10 ${paymentMethod === method.id ? "bg-primary text-white" : "text-zinc-400"}`}
                onPress={() => setPaymentMethod(method.id)}
              >
                <Icon icon={method.icon} className="text-xl" />
                <span className="text-[10px] font-black uppercase tracking-tight">{method.label}</span>
              </Button>
            ))}
          </div>
          <Button 
            variant="primary"
            size="lg" 
            className="w-full font-black uppercase tracking-[0.2em] h-14 bg-white text-black hover:bg-zinc-200 transition-all shadow-2xl"
            isDisabled={cart.length === 0 || isProcessing}
            onPress={handleCheckout}
          >
            {isProcessing ? "Transacting..." : "Finalize & Bill"}
          </Button>
        </div>
      </div>

      {/* Success View */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
           <Card className="w-[400px] p-10 bg-zinc-900 border border-white/10 flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                 <Icon icon="solar:check-circle-bold-duotone" className="text-5xl text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Transaction Encrypted</h2>
                <p className="text-zinc-500 font-medium">Digital invoice successfully dispatched to customer gateway.</p>
              </div>
              <Button 
                variant="primary" 
                className="w-full h-14 bg-white text-black font-black uppercase tracking-widest"
                onPress={() => {
                  setCart([]);
                  setCustomerEmail("");
                  setCustomerName("");
                  setShowSuccess(false);
                }}
              >
                New Session
              </Button>
           </Card>
        </div>
      )}
    </div>
  );
}
