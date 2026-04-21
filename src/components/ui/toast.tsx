"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-left" | "top-center" | "top-right"
  | "bottom-left" | "bottom-center" | "bottom-right";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  position: ToastPosition;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number, position?: ToastPosition) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = "info", duration = 4000, position: ToastPosition = "bottom-right") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, duration, position }]);
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// ── Styling maps ──────────────────────────────────────────────────────────────

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error:   "bg-red-50 border-red-200 text-red-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  info:    "bg-blue-50 border-blue-200 text-blue-800",
};

const iconStyles = {
  success: "text-green-500",
  error:   "text-red-500",
  warning: "text-yellow-500",
  info:    "text-blue-500",
};

/** Fixed-position class + flex direction for each position slot */
const positionClasses: Record<ToastPosition, string> = {
  "top-left":      "top-4 left-4 flex-col",
  "top-center":    "top-4 left-1/2 -translate-x-1/2 flex-col",
  "top-right":     "top-4 right-4 flex-col",
  "bottom-left":   "bottom-4 left-4 flex-col-reverse",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse",
  "bottom-right":  "bottom-4 right-4 flex-col-reverse",
};

// ── Container: renders one fixed group per active position ────────────────────

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  // Group toasts by position
  const groups = toasts.reduce<Partial<Record<ToastPosition, Toast[]>>>((acc, t) => {
    (acc[t.position] ??= []).push(t);
    return acc;
  }, {});

  return (
    <>
      {(Object.entries(groups) as [ToastPosition, Toast[]][]).map(([pos, group]) => (
        <div
          key={pos}
          className={cn(
            "fixed z-[100] flex gap-2 max-w-sm pointer-events-none",
            positionClasses[pos]
          )}
        >
          {group.map((toast) => {
            const Icon = icons[toast.type];
            return (
              <div
                key={toast.id}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 shadow-lg animate-slide-up pointer-events-auto",
                  toastStyles[toast.type]
                )}
              >
                <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", iconStyles[toast.type])} />
                <p className="text-sm font-medium flex-1">{toast.message}</p>
                <button
                  onClick={() => onRemove(toast.id)}
                  className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
