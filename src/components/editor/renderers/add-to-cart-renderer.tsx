"use client";

import React, { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useElementRuntime } from "@/lib/element-runtime-context";
import type { CanvasElement } from "@/lib/types";

export function AddToCartRenderer({ element }: { element: CanvasElement }) {
  const runtime = useElementRuntime();
  const [added, setAdded] = useState(false);

  const productId = (element.props?.productId as string) || element.id;
  const productName = (element.props?.productName as string) || (element.content as string) || "Product";
  const price = parseFloat(String(element.props?.price ?? "0")) || 0;
  const label = (element.props?.label as string) || "Add to Cart";
  const accent = (element.props?.accentColor as string) || "#6366f1";

  const handleClick = () => {
    if (!runtime) return;
    runtime.emit("cart:add", { productId, name: productName, price, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      style={{ backgroundColor: added ? "#10b981" : accent }}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors"
    >
      {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
      {added ? "Added!" : label}
    </button>
  );
}
