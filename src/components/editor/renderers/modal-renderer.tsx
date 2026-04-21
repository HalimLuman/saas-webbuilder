"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useElementRuntime } from "@/lib/element-runtime-context";
import type { CanvasElement } from "@/lib/types";

export function ModalRenderer({ element }: { element: CanvasElement }) {
  const runtime = useElementRuntime();
  const [open, setOpen] = useState(false);

  const title = (element.props?.title as string) || "Modal";
  const size = (element.props?.size as string) || "md";

  const sizeClass: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  useEffect(() => {
    if (!runtime) return;
    const off = runtime.on("modal:open", (payload) => {
      const { targetId } = payload as { targetId?: string };
      if (!targetId || targetId === element.id) {
        setOpen(true);
        runtime.setState(element.id + ":open", true);
      }
    });
    const off2 = runtime.on("modal:close", (payload) => {
      const { targetId } = (payload ?? {}) as { targetId?: string };
      if (!targetId || targetId === element.id) {
        setOpen(false);
        runtime.setState(element.id + ":open", false);
      }
    });
    return () => { off(); off2(); };
  }, [runtime, element.id]);

  if (!open) {
    return (
      <div className="rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50 p-4 text-center">
        <p className="text-xs font-semibold text-indigo-500">Modal: {title}</p>
        <p className="text-[10px] text-indigo-400 mt-0.5">Shown when triggered by a button</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => {
        setOpen(false);
        runtime?.setState(element.id + ":open", false);
      }} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClass[size] ?? sizeClass.md} p-6 z-10`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={() => {
              setOpen(false);
              runtime?.emit("modal:close", { targetId: element.id });
            }}
            className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {element.content || "Modal content goes here."}
        </div>
      </div>
    </div>
  );
}

export function DrawerRenderer({ element }: { element: CanvasElement }) {
  const runtime = useElementRuntime();
  const [open, setOpen] = useState(false);

  const title = (element.props?.title as string) || "Drawer";
  const side = (element.props?.side as string) || "right";

  const slideClass: Record<string, string> = {
    right: "right-0 top-0 h-full w-80",
    left: "left-0 top-0 h-full w-80",
    bottom: "bottom-0 left-0 w-full",
  };

  useEffect(() => {
    if (!runtime) return;
    const off = runtime.on("modal:open", (payload) => {
      const { targetId } = payload as { targetId?: string };
      if (!targetId || targetId === element.id) {
        setOpen(true);
        runtime.setState(element.id + ":open", true);
      }
    });
    const off2 = runtime.on("modal:close", (payload) => {
      const { targetId } = (payload ?? {}) as { targetId?: string };
      if (!targetId || targetId === element.id) {
        setOpen(false);
        runtime.setState(element.id + ":open", false);
      }
    });
    return () => { off(); off2(); };
  }, [runtime, element.id]);

  if (!open) {
    return (
      <div className="rounded-xl border-2 border-dashed border-violet-200 bg-violet-50 p-4 text-center">
        <p className="text-xs font-semibold text-violet-500">Drawer: {title}</p>
        <p className="text-[10px] text-violet-400 mt-0.5">Slides in from {side} when triggered</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={() => {
        setOpen(false);
        runtime?.setState(element.id + ":open", false);
      }} />
      <div className={`absolute bg-white shadow-2xl p-6 ${slideClass[side] ?? slideClass.right}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={() => {
              setOpen(false);
              runtime?.emit("modal:close", { targetId: element.id });
            }}
            className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {element.content || "Drawer content goes here."}
        </div>
      </div>
    </div>
  );
}
