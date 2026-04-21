"use client";

import React, { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useElementRuntime } from "@/lib/element-runtime-context";
import type { CanvasElement } from "@/lib/types";

export function ProductCardRenderer({ element }: { element: CanvasElement }) {
  const runtime = useElementRuntime();
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const productId = (element.props?.productId as string) || element.id;
  const name = (element.props?.name as string) || "Product Name";
  const price = parseFloat(String(element.props?.price ?? "29.99"));
  const originalPrice = element.props?.originalPrice ? parseFloat(String(element.props.originalPrice)) : null;
  const rating = parseFloat(String(element.props?.rating ?? "4.5"));
  const reviewCount = parseInt(String(element.props?.reviewCount ?? "128"), 10);
  const imageUrl = (element.props?.imageUrl as string) || "";
  const badge = (element.props?.badge as string) || "";
  const accent = (element.props?.accentColor as string) || "#6366f1";

  const handleAddToCart = () => {
    if (!runtime) return;
    runtime.emit("cart:add", { productId, name, price, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const toggleWishlist = () => {
    if (!runtime) return;
    const wishlist = (runtime.getState("wishlist") as string[]) ?? [];
    const next = wishlisted
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    runtime.setState("wishlist", next);
    setWishlisted(!wishlisted);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ShoppingCart className="h-12 w-12" />
          </div>
        )}
        {badge && (
          <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full text-white" style={{ backgroundColor: accent }}>
            {badge}
          </span>
        )}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{name}</h3>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className={`h-3 w-3 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
          ))}
          <span className="text-xs text-gray-400 ml-1">({reviewCount})</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold text-gray-900">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-2 py-1 text-gray-500 hover:bg-gray-50 text-sm">−</button>
            <span className="px-3 py-1 text-sm font-medium">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-50 text-sm">+</button>
          </div>
          <button
            onClick={handleAddToCart}
            style={{ backgroundColor: added ? "#10b981" : accent }}
            className="flex-1 py-2 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {added ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
