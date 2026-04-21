"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { useElementRuntime } from "@/lib/element-runtime-context";
import type { CanvasElement } from "@/lib/types";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export function CartRenderer({ element }: { element: CanvasElement }) {
  const runtime = useElementRuntime();
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const cartStyle = (element.props?.cartStyle as string) || "dropdown";
  const currency = (element.props?.currency as string) || "USD";
  const checkoutUrl = (element.props?.checkoutUrl as string) || "#";

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

  const syncFromState = useCallback(() => {
    if (!runtime) return;
    const stored = runtime.getState("cart") as CartItem[] | undefined;
    setItems(stored ?? []);
  }, [runtime]);

  useEffect(() => {
    if (!runtime) return;
    syncFromState();
    const off1 = runtime.on("cart:add", (payload) => {
      const item = payload as CartItem;
      runtime.setState("cart", (() => {
        const current = (runtime.getState("cart") as CartItem[]) ?? [];
        const idx = current.findIndex((i) => i.productId === item.productId);
        if (idx >= 0) {
          const updated = [...current];
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + (item.quantity || 1) };
          return updated;
        }
        return [...current, { ...item, quantity: item.quantity || 1 }];
      })());
      syncFromState();
    });
    const off2 = runtime.on("cart:remove", (payload) => {
      const { productId } = payload as { productId: string };
      const current = (runtime.getState("cart") as CartItem[]) ?? [];
      runtime.setState("cart", current.filter((i) => i.productId !== productId));
      syncFromState();
    });
    const off3 = runtime.on("cart:clear", () => {
      runtime.setState("cart", []);
      syncFromState();
    });
    return () => { off1(); off2(); off3(); };
  }, [runtime, syncFromState]);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  const updateQty = (productId: string, delta: number) => {
    if (!runtime) return;
    const current = (runtime.getState("cart") as CartItem[]) ?? [];
    const updated = current.map((i) =>
      i.productId === productId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
    ).filter((i) => i.quantity > 0);
    runtime.setState("cart", updated);
    setItems(updated);
  };

  const CartPanel = (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4 min-w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Shopping Cart ({count})</h3>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                {item.image && (
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{fmt(item.price)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.productId, -1)} className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.productId, 1)} className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                    <Plus className="h-3 w-3" />
                  </button>
                  <button onClick={() => runtime?.emit("cart:remove", { productId: item.productId })} className="ml-1 text-red-400 hover:text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-900">Total</span>
            <span className="text-sm font-bold text-gray-900">{fmt(total)}</span>
          </div>
          <a
            href={checkoutUrl}
            className="block w-full bg-indigo-600 text-white text-sm font-medium text-center py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Checkout
          </a>
          <button
            onClick={() => runtime?.emit("cart:clear", {})}
            className="mt-2 w-full text-xs text-gray-400 hover:text-gray-600 text-center"
          >
            Clear cart
          </button>
        </>
      )}
    </div>
  );

  if (cartStyle === "inline") {
    return CartPanel;
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <ShoppingCart className="h-5 w-5 text-gray-700" />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
        {cartStyle !== "sidebar" && <span className="text-sm font-medium text-gray-700">Cart</span>}
      </button>

      {open && cartStyle === "dropdown" && (
        <div className="absolute right-0 top-full mt-2 z-50">
          {CartPanel}
        </div>
      )}

      {open && cartStyle === "sidebar" && (
        <div className="fixed inset-y-0 right-0 z-50 flex">
          <div className="fixed inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative ml-auto w-80 h-full bg-white shadow-2xl p-6 overflow-y-auto">
            {CartPanel}
          </div>
        </div>
      )}
    </div>
  );
}
