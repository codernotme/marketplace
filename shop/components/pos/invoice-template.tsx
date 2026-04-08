"use client";

import React from "react";

interface InvoiceProps {
  shopName: string;
  orderNumber: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  customerName?: string;
  paymentMethod: string;
}

export const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceProps>((props, ref) => {
  const { shopName, orderNumber, date, items, subtotal, tax, total, customerName, paymentMethod } = props;

  return (
    <div ref={ref} className="p-8 bg-white text-black max-w-[400px] border shadow-sm mx-auto my-4 print:m-0 print:border-0 print:shadow-none">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold uppercase tracking-wider">{shopName}</h1>
        <p className="text-sm text-gray-500">Official Receipt</p>
      </div>

      <div className="flex justify-between text-xs mb-4">
        <div>
          <p><strong>Order:</strong> {orderNumber}</p>
          <p><strong>Date:</strong> {date}</p>
        </div>
        <div className="text-right">
          {customerName && <p><strong>Customer:</strong> {customerName}</p>}
          <p><strong>Payment:</strong> {paymentMethod.toUpperCase()}</p>
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      <div className="space-y-2 mb-6">
        <div className="flex justify-between font-bold text-xs uppercase">
          <span className="w-1/2">Item</span>
          <span className="w-1/4 text-center">Qty</span>
          <span className="w-1/4 text-right">Price</span>
        </div>
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="w-1/2 truncate">{item.name}</span>
            <span className="w-1/4 text-center">x{item.quantity}</span>
            <span className="w-1/4 text-right">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <hr className="my-4 border-gray-200" />

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2">
          <span>TOTAL</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-8 text-center text-[10px] text-gray-400">
        <p>Thank you for shopping with us!</p>
        <p>This is a computer generated invoice.</p>
        <p className="mt-2">theMrktPlace Platform</p>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = "InvoiceTemplate";
