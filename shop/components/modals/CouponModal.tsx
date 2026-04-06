"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useCouponsStore, useUIStore, type ModalMode } from "@/lib/store";
import { cn } from "@/lib/utils";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  data?: any;
}

export function CouponModal({ isOpen, onClose, mode, data }: CouponModalProps) {
  const { addCoupon, updateCoupon } = useCouponsStore();
  const [form, setForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed" | "free_shipping" | "bxgy",
    value: "",
    minOrderValue: "",
    maxDiscount: "",
    usageLimit: "100",
    perUserLimit: "1",
    expiresAt: "",
    applicableTo: "all" as "all" | "category" | "product",
  });

  useEffect(() => {
    if (mode === "edit" && data) {
      setForm({
        code: data.code || "",
        type: data.type || "percentage",
        value: String(data.value || ""),
        minOrderValue: String(data.minOrderValue || ""),
        maxDiscount: String(data.maxDiscount || ""),
        usageLimit: String(data.usageLimit || "100"),
        perUserLimit: String(data.perUserLimit || "1"),
        expiresAt: data.expiresAt ? data.expiresAt.split("T")[0] : "",
        applicableTo: data.applicableTo || "all",
      });
    } else {
      setForm({
        code: "",
        type: "percentage",
        value: "",
        minOrderValue: "",
        maxDiscount: "",
        usageLimit: "100",
        perUserLimit: "1",
        expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        applicableTo: "all",
      });
    }
  }, [mode, data, isOpen]);

  const handleSubmit = () => {
    if (!form.code.trim()) return;

    const payload = {
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value) || 0,
      minOrderValue: Number(form.minOrderValue) || 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      usageLimit: Number(form.usageLimit) || 100,
      perUserLimit: Number(form.perUserLimit) || 1,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : new Date().toISOString(),
      applicableTo: form.applicableTo,
    };

    if (mode === "edit" && data?.id) {
      updateCoupon(data.id, payload);
    } else {
      addCoupon({
        ...payload,
        id: `cpn_${Date.now()}`,
        usedCount: 0,
        isActive: true,
      });
    }
    onClose();
  };

  const inputCls = "w-full bg-default/40 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all duration-200";
  const labelCls = "block text-[10px] font-black text-muted mb-1.5 uppercase tracking-widest opacity-80";

  return (
    <Modal>
      <Modal.Backdrop 
        isOpen={isOpen} 
        onOpenChange={onClose}
        variant="blur"
        className="bg-black/60"
      >
        <Modal.Container placement="center">
          <Modal.Dialog className="bg-surface border border-border rounded-[2rem] shadow-2xl overflow-hidden max-w-2xl w-full">
            <Modal.Header className="px-8 py-6 border-b border-border bg-default/5 flex items-center gap-4">
              <Modal.Icon className="bg-accent/20 text-accent">
                <Icon icon="solar:ticket-bold-duotone" className="text-2xl" />
              </Modal.Icon>
              <div>
                <Modal.Heading className="text-xl font-black tracking-tight">{mode === "edit" ? "Edit Coupon" : "New Promotion"}</Modal.Heading>
                <p className="text-xs text-muted font-medium">Create and manage discount codes</p>
              </div>
            </Modal.Header>

            <Modal.Body className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelCls}>Coupon Promo Code *</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SUMMER2024"
                    className={`${inputCls} font-mono font-bold text-accent tracking-widest text-lg`}
                  />
                </div>

                <div>
                  <label className={labelCls}>Discount Type</label>
                  <Dropdown>
                    <Dropdown.Trigger>
                      <button className={cn(inputCls, "flex items-center justify-between cursor-pointer font-bold outline-none")}>
                        <span>{form.type.split("_").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")}</span>
                        <Icon icon="solar:alt-arrow-down-bold-duotone" className="text-muted" />
                      </button>
                    </Dropdown.Trigger>
                    <Dropdown.Popover className="min-w-[200px]">
                      <Dropdown.Menu onSelectionChange={(keys) => setForm({ ...form, type: Array.from(keys)[0] as any })} selectionMode="single" selectedKeys={new Set([form.type])}>
                        {[
                          { id: "percentage", label: "Percentage (%)", icon: "solar:percentage-bold-duotone" },
                          { id: "fixed", label: "Fixed Amount (₹)", icon: "solar:wad-of-money-bold-duotone" },
                          { id: "free_shipping", label: "Free Shipping", icon: "solar:delivery-bold-duotone" },
                          { id: "bxgy", label: "Buy X Get Y", icon: "solar:box-bold-duotone" },
                        ].map((t) => (
                          <Dropdown.Item key={t.id} id={t.id} textValue={t.label}>
                            <div className="flex items-center gap-2">
                              <Icon icon={t.icon} className="text-lg text-muted" />
                              <Label className="font-bold text-xs uppercase tracking-wider">{t.label}</Label>
                            </div>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown.Popover>
                  </Dropdown>
                </div>

                <div>
                  <label className={labelCls}>Discount Value</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    placeholder="e.g. 20"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Min. Order Value (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderValue}
                    onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                    placeholder="0"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Max. Discount (₹)</label>
                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                    placeholder="Optional"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Total Usage Limit</label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    className={inputCls}
                  />
                  <p className="text-[9px] text-muted mt-1 uppercase font-bold tracking-tighter">Maximum times code can be used</p>
                </div>

                <div>
                  <label className={labelCls}>Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="px-8 py-6 border-t border-border flex items-center justify-end gap-3 bg-default/5">
              <Button variant="secondary" onPress={onClose} className="rounded-xl font-bold px-6">Cancel</Button>
              <Button variant="primary" onPress={handleSubmit} className="rounded-xl font-bold px-8 shadow-lg shadow-accent/20">
                {mode === "edit" ? "Save Changes" : "Create Coupon"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
