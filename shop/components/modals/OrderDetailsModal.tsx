"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Dropdown, Label, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useOrdersStore, useUIStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import type { Order, DeliveryAgent, OrderStatus } from "@/lib/mock-data";

const STAGES = [
  { label: "Pending", icon: "solar:clock-circle-bold-duotone", status: "pending" as OrderStatus },
  { label: "Processing", icon: "solar:refresh-bold-duotone", status: "processing" as OrderStatus },
  { label: "Packed", icon: "solar:box-bold-duotone", status: "packed" as OrderStatus },
  { label: "Shipped", icon: "solar:delivery-bold-duotone", status: "shipped" as OrderStatus },
  { label: "Delivered", icon: "solar:check-circle-bold-duotone", status: "delivered" as OrderStatus },
];

export function OrderDetailsModal({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data?: Order }) {
  const { updateOrderStage, updateOrderStatus, addDeliveryAgent } = useOrdersStore();
  const [activeStage, setActiveStage] = useState(0);
  const [agentName, setAgentName] = useState("");
  const [courier, setCourier] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  useEffect(() => {
    if (data) {
      setActiveStage(data.currentStage ?? 0);
    }
  }, [data, isOpen]);

  if (!data) return null;

  const handleStageChange = (index: number) => {
    setActiveStage(index);
    updateOrderStage(data.id, index);
    updateOrderStatus(data.id, STAGES[index].status);
  };

  const handleAddAgent = () => {
    if (!agentName || !courier || !trackingUrl) return;
    const newAgent: DeliveryAgent = {
      id: `da_${Date.now()}`,
      name: agentName,
      courier,
      trackingUrl,
      assignedAt: new Date().toISOString(),
    };
    addDeliveryAgent(data.id, newAgent);
    setAgentName("");
    setCourier("");
    setTrackingUrl("");
  };

  return (
    <Modal>
      <Modal.Backdrop 
        isOpen={isOpen} 
        onOpenChange={onClose}
        variant="blur"
        className="bg-black/60"
      >
        <Modal.Container placement="center">
          <Modal.Dialog className="bg-surface border border-border rounded-[2.5rem] shadow-2xl overflow-hidden max-w-4xl w-full h-[85vh] flex flex-col">
            <Modal.Header className="px-8 py-6 border-b border-border bg-default/5 flex items-center justify-between flex-shrink-0">
               <div className="flex items-center gap-4">
                <Modal.Icon className="bg-accent/20 text-accent">
                  <Icon icon="solar:cart-large-bold-duotone" className="text-2xl" />
                </Modal.Icon>
                <div>
                  <Modal.Heading className="text-xl font-black tracking-tight">{data.orderNumber}</Modal.Heading>
                  <p className="text-xs text-muted font-medium">Placed on {new Date(data.createdAt).toLocaleString("en-IN")}</p>
                </div>
              </div>
              <Button variant="secondary" onPress={onClose} isIconOnly className="rounded-xl">
                <Icon icon="solar:close-circle-bold-duotone" className="text-xl" />
              </Button>
            </Modal.Header>

            <Modal.Body className="flex-1 overflow-y-auto p-8 scrollbar-hide space-y-8">
              {/* Fulfillment Stepper */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Order Fulfillment Stages</h3>
                <div className="relative flex justify-between items-start">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10" />
                  <div 
                    className="absolute top-5 left-0 h-0.5 bg-accent transition-all duration-500 -z-10" 
                    style={{ width: `${(activeStage / (STAGES.length - 1)) * 100}%` }}
                  />
                  {STAGES.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleStageChange(i)}
                      className="flex flex-col items-center gap-2 group outline-none"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                        i <= activeStage 
                          ? "bg-accent border-accent/20 text-white shadow-lg shadow-accent/30" 
                          : "bg-surface border-border text-muted hover:border-accent/40"
                      }`}>
                        <Icon icon={s.icon} className="text-lg" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${i <= activeStage ? "text-foreground" : "text-muted"}`}>
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Left Column: Items */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Items Summary</h3>
                  <div className="bg-default/30 rounded-2xl border border-border/50 divide-y divide-border/40 overflow-hidden">
                    {data.items.map((item, i) => (
                      <div key={i} className="p-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center flex-shrink-0">
                           <Icon icon="solar:box-bold-duotone" className="text-muted text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{item.title}</p>
                          <p className="text-xs text-muted font-medium">{item.variant} × {item.qty}</p>
                        </div>
                        <p className="text-sm font-black">{formatCurrency(item.price * item.qty)}</p>
                      </div>
                    ))}
                    <div className="p-4 bg-default/10 space-y-1.5 pt-4">
                       <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted">Subtotal</span>
                        <span>{formatCurrency(data.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted">Shipping</span>
                        <span>{data.shippingCost === 0 ? "Free" : formatCurrency(data.shippingCost)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted">Tax (GST)</span>
                        <span>{formatCurrency(data.tax)}</span>
                      </div>
                      {data.discount > 0 && (
                        <div className="flex justify-between text-xs font-medium text-success">
                          <span>Discount</span>
                          <span>−{formatCurrency(data.discount)}</span>
                        </div>
                      )}
                      <Separator className="my-2 border-border/50" />
                      <div className="flex justify-between text-base font-black">
                        <span>Total Paid</span>
                        <span className="text-accent">{formatCurrency(data.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Customer & Shipping */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Customer & Shipping</h3>
                    <div className="p-5 rounded-3xl bg-default/40 border border-border/50 space-y-4">
                      <div>
                        <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Contact Details</p>
                        <p className="text-sm font-bold">{data.customer.name}</p>
                        <p className="text-xs text-muted font-medium">{data.customer.email}</p>
                        <p className="text-xs text-muted font-medium">{data.customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Delivery Address</p>
                        <p className="text-sm font-medium leading-relaxed">{data.shippingAddress.line1}</p>
                        <p className="text-sm font-medium leading-relaxed">
                          {data.shippingAddress.city}, {data.shippingAddress.state} — {data.shippingAddress.pincode}
                        </p>
                      </div>
                      <div className="flex gap-2">
                         <span className="px-3 py-1 rounded-lg bg-success/15 text-success text-[10px] font-bold uppercase">{data.paymentStatus}</span>
                         <span className="px-3 py-1 rounded-lg bg-accent/15 text-accent text-[10px] font-bold uppercase">{data.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Agents */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Delivery Assignment</h3>
                    
                    {/* Add Agent Form */}
                    <div className="p-5 rounded-3xl bg-default/40 border border-border/50 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          placeholder="Agent Name" 
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-accent"
                        />
                         <input 
                          placeholder="Courier/Partner (e.g. Delhivery)" 
                          value={courier}
                          onChange={(e) => setCourier(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-accent"
                        />
                      </div>
                      <input 
                        placeholder="Tracking URL" 
                        value={trackingUrl}
                        onChange={(e) => setTrackingUrl(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-accent"
                      />
                      <Button 
                        onPress={handleAddAgent}
                        className="w-full rounded-xl font-bold bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all py-2 h-auto"
                      >
                        <Icon icon="solar:user-plus-bold" className="mr-1.5" /> Assign New Agent
                      </Button>
                    </div>

                    {/* Agents List */}
                    <div className="space-y-2">
                      {data.deliveryAgents?.map((agent) => (
                        <div key={agent.id} className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-black text-[10px]">
                              {agent.name.charAt(0)}
                            </div>
                            <div>
                               <p className="text-xs font-bold">{agent.name}</p>
                               <p className="text-[10px] text-muted font-medium">{agent.courier}</p>
                            </div>
                          </div>
                          <a 
                            href={agent.trackingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-default/50 text-muted hover:text-accent transition-colors"
                          >
                             <Icon icon="solar:link-bold" className="text-base" />
                          </a>
                        </div>
                      ))}
                      {(!data.deliveryAgents || data.deliveryAgents.length === 0) && (
                        <p className="text-center py-4 text-xs text-muted italic font-medium">No agents assigned yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
