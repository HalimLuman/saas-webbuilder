"use client";

import { createContext, useContext, useRef } from "react";
import { useEditorStore } from "@/store/editor-store";

export interface ElementRuntime {
  getState: (key: string) => unknown;
  setState: (key: string, value: unknown) => void;
  emit: (event: string, payload: unknown) => void;
  on: (event: string, cb: (payload: unknown) => void) => () => void;
}

export const ElementRuntimeContext = createContext<ElementRuntime | null>(null);

export function useElementRuntime(): ElementRuntime | null {
  return useContext(ElementRuntimeContext);
}

export function ElementRuntimeProvider({ children }: { children: React.ReactNode }) {
  const getElementState = useEditorStore((s) => s.getElementState);
  const setElementState = useEditorStore((s) => s.setElementState);
  const broadcastElementEvent = useEditorStore((s) => s.broadcastElementEvent);
  const onElementEvent = useEditorStore((s) => s.onElementEvent);

  // Stable ref so the context value never causes re-renders
  const runtimeRef = useRef<ElementRuntime>({
    getState: getElementState,
    setState: setElementState,
    emit: broadcastElementEvent,
    on: onElementEvent,
  });

  // Mutate the existing object in-place so the reference stays stable.
  // Creating a new object here would change the context value on every parent
  // re-render, causing every consumer (CartRenderer, ModalRenderer, etc.) to
  // re-render and re-run their effects — leading to an infinite update loop.
  runtimeRef.current.getState = getElementState;
  runtimeRef.current.setState = setElementState;
  runtimeRef.current.emit = broadcastElementEvent;
  runtimeRef.current.on = onElementEvent;

  return (
    <ElementRuntimeContext.Provider value={runtimeRef.current}>
      {children}
    </ElementRuntimeContext.Provider>
  );
}
