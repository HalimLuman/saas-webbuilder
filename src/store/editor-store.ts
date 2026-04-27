import { create, type StateCreator } from "zustand";
import type { CanvasElement, DeviceMode, ElementType, ElementStyles, AnimationConfig, HoverStyles, FocusStyles, ActiveStyles, DesignTokens, PageSEO } from "@/lib/types";
import { generateId } from "@/lib/utils";

const DEFAULT_TOKENS: DesignTokens = {
  colors: {
    primary: "#6366F1",
    secondary: "#8B5CF6",
    accent: "#EC4899",
    background: "#FFFFFF",
    surface: "#F9FAFB",
    text: "#111827",
    textMuted: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  },
  typography: {
    fontHeading: "Inter",
    fontBody: "Inter",
    fontMono: "JetBrains Mono",
    sizeBase: 16,
    scaleRatio: 1.25,
  },
  spacing: { base: 8 },
  borderRadius: { sm: "4px", md: "8px", lg: "12px", xl: "16px", full: "9999px" },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.07)",
    lg: "0 10px 15px rgba(0,0,0,0.1)",
    xl: "0 20px 25px rgba(0,0,0,0.1)",
  },
};

// ─── Tree helpers ─────────────────────────────────────────────────────────────

function updateInTree(
  elements: CanvasElement[],
  id: string,
  updater: (el: CanvasElement) => CanvasElement
): CanvasElement[] {
  return elements.map((el) => {
    if (el.id === id) return updater(el);
    if (el.children?.length) {
      return { ...el, children: updateInTree(el.children, id, updater) };
    }
    return el;
  });
}

function removeFromTree(elements: CanvasElement[], id: string): CanvasElement[] {
  return elements
    .filter((el) => el.id !== id)
    .map((el) => {
      if (el.children?.length) {
        return { ...el, children: removeFromTree(el.children, id) };
      }
      return el;
    });
}

export function findInTree(
  elements: CanvasElement[],
  id: string
): CanvasElement | undefined {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children?.length) {
      const found = findInTree(el.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface HistoryState {
  elements: CanvasElement[];
}

export interface NamedSnapshot {
  id: string;
  name: string;
  elements: CanvasElement[];
  createdAt: Date;
}

export interface EditorStore {
  // State
  elements: CanvasElement[];
  selectedElementId: string | null;
  deviceMode: DeviceMode;
  isPreviewMode: boolean;
  isSaving: boolean;
  saveFailed: boolean;
  lastSaved: Date | null;
  undoStack: HistoryState[];
  redoStack: HistoryState[];
  siteId: string | null;
  siteName: string;
  currentPage: string;
  currentPageId: string | null;
  zoom: number;
  showGrid: boolean;
  clipboard: CanvasElement | null;
  designTokens: DesignTokens;
  namedSnapshots: NamedSnapshot[];
  pageSEO: PageSEO;
  pageCustomCSS: string;
  pageCustomJS: string;
  pageCustomHTML: string;
  pageResponsiveCSS: Record<string, string>;

  // Actions
  setSiteId: (id: string) => void;
  setSiteName: (name: string) => void;
  setCurrentPage: (page: string) => void;
  setCurrentPageId: (id: string | null) => void;
  setDeviceMode: (mode: DeviceMode) => void;
  setPreviewMode: (isPreview: boolean) => void;
  saveNamedSnapshot: (name: string) => void;
  restoreSnapshot: (id: string) => void;
  deleteSnapshot: (id: string) => void;
  updatePageSEO: (seo: Partial<PageSEO>) => void;
  updatePageCustomCSS: (css: string) => void;
  updatePageCustomJS: (js: string) => void;
  updatePageCustomHTML: (html: string) => void;
  updatePageResponsiveCSS: (bp: string, css: string) => void;
  wrapInContainer: (id: string) => void;
  selectElement: (id: string | null) => void;
  addElement: (type: ElementType, position?: number) => void;
  addElementFromDrag: (element: Partial<CanvasElement>) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  updateElementStyles: (id: string, styles: Partial<ElementStyles>) => void;
  updateElementContent: (id: string, content: string) => void;
  updateElementProps: (id: string, props: Record<string, unknown>) => void;
  updateElementResponsiveStyles: (id: string, bp: "large-tablet" | "tablet" | "mobile" | "small-mobile", overrides: Partial<ElementStyles> & Record<string, unknown>) => void;
  clearElementResponsiveStyles: (id: string, bp: "large-tablet" | "tablet" | "mobile" | "small-mobile") => void;
  updateElementAnimation: (id: string, animation: Partial<AnimationConfig>) => void;
  updateElementHoverStyles: (id: string, hoverStyles: Partial<HoverStyles>) => void;
  updateElementFocusStyles: (id: string, focusStyles: Partial<FocusStyles>) => void;
  updateElementActiveStyles: (id: string, activeStyles: Partial<ActiveStyles>) => void;
  updateElementName: (id: string, name: string) => void;
  updateDescendantsStyles: (parentId: string, styles: Partial<ElementStyles>, targetType?: ElementType) => void;
  batchUpdateElements: (updates: { elementId: string; styles?: Partial<ElementStyles>; content?: string; props?: Record<string, unknown> }[]) => void;
  addChildElement: (parentId: string, childData: Partial<CanvasElement>) => void;
  removeChildElement: (parentId: string, childId: string) => void;
  setElementChildren: (id: string, children: CanvasElement[]) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  copyElement: (id: string) => void;
  pasteElement: () => void;
  toggleElementLock: (id: string) => void;
  toggleElementVisibility: (id: string) => void;
  reorderElements: (activeId: string, overId: string) => void;
  moveElement: (activeId: string, targetId: string | null, placement: "before" | "after" | "inside") => void;
  undo: () => void;
  redo: () => void;
  saveState: () => void;
  setIsSaving: (saving: boolean) => void;
  // Runtime element state (for canvas preview — not persisted)
  elementState: Record<string, unknown>;
  setElementState: (key: string, value: unknown) => void;
  getElementState: (key: string) => unknown;
  broadcastElementEvent: (event: string, payload: unknown) => void;
  _elementEventHandlers: Record<string, Array<(payload: unknown) => void>>;
  onElementEvent: (event: string, handler: (payload: unknown) => void) => () => void;
  loadElements: (elements: CanvasElement[]) => void;
  clearCanvas: () => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  toggleGrid: () => void;
  updateDesignTokens: (tokens: Partial<DesignTokens>) => void;
  triggerAutoSave: () => void;
}

// ─── Layout default children helper ──────────────────────────────────────────

function getLayoutDefaultChildren(type: string): CanvasElement[] | undefined {
  const makeCol = (i: number): CanvasElement => ({
    id: generateId(),
    type: "container" as ElementType,
    content: "",
    order: i,
    styles: {},
    props: { _childLayout: "column" },
  });
  switch (type) {
    case "two-col": return [makeCol(0), makeCol(1)];
    case "three-col": return [makeCol(0), makeCol(1), makeCol(2)];
    case "four-col": return [makeCol(0), makeCol(1), makeCol(2), makeCol(3)];
    case "sidebar-left": return [makeCol(0), makeCol(1)];
    case "sidebar-right": return [makeCol(0), makeCol(1)];
    default: return undefined;
  }
}


// ─── Store ────────────────────────────────────────────────────────────────────

let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

const storeCreator: StateCreator<EditorStore> = (set, get) => ({
      elements: [],
      selectedElementId: null,
      deviceMode: "desktop",
      isPreviewMode: false,
      isSaving: false,
      saveFailed: false,
      lastSaved: null,
      elementState: {},
      _elementEventHandlers: {},
      undoStack: [],
      redoStack: [],
      siteId: null,
      siteName: "Untitled Site",
      currentPage: "/",
      currentPageId: null,
      zoom: 100,
      showGrid: false,
      clipboard: null,
      designTokens: DEFAULT_TOKENS,
      namedSnapshots: [],
      pageSEO: {},
      pageCustomCSS: "",
      pageCustomJS: "",
      pageCustomHTML: "",
      pageResponsiveCSS: {},

      setSiteId: (id) => set({ siteId: id }),
      setSiteName: (name) => set({ siteName: name }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setCurrentPageId: (id) => set({ currentPageId: id }),
      setDeviceMode: (mode) => set({ deviceMode: mode }),
      setPreviewMode: (isPreview) => set({ isPreviewMode: isPreview }),

      selectElement: (id) => set({ selectedElementId: id }),

      addElement: (type, position) => {
        const { elements } = get();
        const newElement: CanvasElement = {
          id: generateId(),
          type,
          content: type,
          order: position !== undefined ? position : elements.length,
          styles: {},
          children: getLayoutDefaultChildren(type),
        };

        get().saveState();
        const newElements = [...elements, newElement].sort((a, b) => a.order - b.order);
        set({ elements: newElements, redoStack: [] });
      },

      addElementFromDrag: (elementData) => {
        const { elements } = get();
        const deepCloneWithNewIds = (el: any, index: number): CanvasElement => ({
          ...el,
          id: generateId(),
          order: el.order !== undefined ? el.order : index,
          children: el.children?.map((c: any, i: number) => deepCloneWithNewIds(c, i)),
        });
        const newElement: CanvasElement = {
          id: generateId(),
          type: elementData.type || "paragraph",
          content: elementData.content || "",
          order: elementData.order !== undefined ? elementData.order : elements.length,
          styles: elementData.styles || {},
          props: elementData.props || {},
          children: elementData.children
            ? elementData.children.map((c: any, i: number) => deepCloneWithNewIds(c, i))
            : getLayoutDefaultChildren(elementData.type || "paragraph"),
        };

        get().saveState();
        set({ elements: [...elements, newElement], redoStack: [] });
      },

      updateElement: (id, updates) => {
        const { elements } = get();
        set({ elements: updateInTree(elements, id, (el) => ({ ...el, ...updates })) });
      },

      updateElementStyles: (id, styles) => {
        const { elements } = get();
        set({
          elements: updateInTree(elements, id, (el) => ({
            ...el,
            styles: { ...el.styles, ...styles },
          })),
        });
      },

      updateElementContent: (id, content) => {
        const { elements } = get();
        set({ elements: updateInTree(elements, id, (el) => ({ ...el, content })) });
      },

      updateElementProps: (id, props) => {
        const { elements } = get();
        get().saveState();
        set({
          elements: updateInTree(elements, id, (el) => ({
            ...el,
            props: { ...el.props, ...props },
          })),
          redoStack: [],
        });
      },

      updateElementResponsiveStyles: (id, bp, overrides) => {
        set({
          elements: updateInTree(get().elements, id, (el) => {
            const existing = (el.props?._responsive as Record<string, unknown>) || {};
            const bpExisting = (existing[bp] as Record<string, unknown>) || {};
            // Merge delta into existing bp data (undefined values remove a key)
            const merged: Record<string, unknown> = { ...bpExisting };
            for (const [k, v] of Object.entries(overrides)) {
              if (v === undefined || v === null || v === "") delete merged[k];
              else merged[k] = v;
            }
            return {
              ...el,
              props: {
                ...el.props,
                _responsive: {
                  ...existing,
                  [bp]: Object.keys(merged).length ? merged : undefined,
                },
              },
            };
          }),
        });
      },

      clearElementResponsiveStyles: (id: string, bp: "large-tablet" | "tablet" | "mobile" | "small-mobile") => {
        set({
          elements: updateInTree(get().elements, id, (el) => {
            const existing = (el.props?._responsive as Record<string, unknown>) || {};
            const updated = { ...existing, [bp]: undefined };
            return { ...el, props: { ...el.props, _responsive: updated } };
          }),
        });
      },

      addChildElement: (parentId, childData) => {
        const { elements } = get();
        const childType = childData.type || "paragraph";
        get().saveState();
        set({
          elements: updateInTree(elements, parentId, (el) => ({
            ...el,
            children: [
              ...(el.children || []),
              {
                id: generateId(),
                type: childType,
                content: childData.content || "",
                order: (el.children || []).length,
                styles: childData.styles || {},
                props: childData.props || {},
                children: getLayoutDefaultChildren(childType),
              },
            ],
          })),
          redoStack: [],
        });
      },

      removeChildElement: (parentId, childId) => {
        const { elements } = get();
        get().saveState();
        set({
          elements: updateInTree(elements, parentId, (el) => ({
            ...el,
            children: (el.children || []).filter((c) => c.id !== childId),
          })),
          selectedElementId: null,
          redoStack: [],
        });
      },

      setElementChildren: (id, children) => {
        const { elements } = get();
        get().saveState();
        set({
          elements: updateInTree(elements, id, (el) => ({ ...el, children })),
          redoStack: [],
        });
      },

      batchUpdateElements: (updates) => {
        const { elements } = get();
        get().saveState();

        const updateRecursive = (items: CanvasElement[]): CanvasElement[] => {
          return items.map((el) => {
            const update = updates.find(u => u.elementId === el.id);
            let updatedEl = el;
            if (update) {
              updatedEl = {
                ...el,
                ...(update.content !== undefined ? { content: update.content } : {}),
                ...(update.styles ? { styles: { ...el.styles, ...update.styles } } : {}),
                ...(update.props ? { props: { ...el.props, ...update.props } } : {})
              };
            }
            if (updatedEl.children?.length) {
              return { ...updatedEl, children: updateRecursive(updatedEl.children) };
            }
            return updatedEl;
          });
        };

        set({
          elements: updateRecursive(elements),
          redoStack: [],
        });
      },


      removeElement: (id) => {
        const { elements } = get();
        get().saveState();
        set({
          elements: removeFromTree(elements, id),
          selectedElementId: null,
          redoStack: [],
        });
      },

      reorderElements: (activeId, overId) => {
        const { elements } = get();
        get().saveState();

        const reorderRecursive = (items: CanvasElement[]): CanvasElement[] => {
          const activeIndex = items.findIndex((el) => el.id === activeId);
          const overIndex = items.findIndex((el) => el.id === overId);

          if (activeIndex !== -1 && overIndex !== -1) {
            const result = [...items];
            const [removed] = result.splice(activeIndex, 1);
            result.splice(overIndex, 0, removed);
            return result.map((el, index) => ({ ...el, order: index }));
          }

          return items.map((el) => {
            if (el.children?.length) {
              return { ...el, children: reorderRecursive(el.children) };
            }
            return el;
          });
        };

        set({ elements: reorderRecursive(elements), redoStack: [] });
      },

      moveElement: (activeId, targetId, placement) => {
        const { elements } = get();
        
        // Prevent moving a node into itself or its descendants
        const isDescendant = (parentId: string, target: string): boolean => {
          if (parentId === target) return true;
          const parent = findInTree(elements, parentId);
          if (!parent || !parent.children) return false;
          return parent.children.some(c => isDescendant(c.id, target));
        };
        if (targetId && isDescendant(activeId, targetId)) return;
        
        const activeEl = findInTree(elements, activeId);
        if (!activeEl) return;
        
        get().saveState();

        // 1. Remove activeEl from tree
        let newElements = removeFromTree(elements, activeId);

        // 2. Insert activeEl at the target
        if (targetId === null) {
            if (placement === "after") {
                newElements.push(activeEl);
            } else {
                newElements.unshift(activeEl);
            }
            newElements = newElements.map((el, i) => ({ ...el, order: i }));
        } else {
            const insertRecursive = (items: CanvasElement[]): CanvasElement[] => {
                const targetIndex = items.findIndex((el) => el.id === targetId);
                if (targetIndex !== -1) {
                    if (placement === "inside") {
                        return items.map(el => {
                            if (el.id === targetId) {
                                return { ...el, children: [...(el.children || []), activeEl].map((c, i) => ({ ...c, order: i })) };
                            }
                            return el;
                        });
                    } else {
                        const result = [...items];
                        const insertIdx = placement === "after" ? targetIndex + 1 : targetIndex;
                        result.splice(insertIdx, 0, activeEl);
                        return result.map((el, i) => ({ ...el, order: i }));
                    }
                }
                return items.map((el) => {
                    if (el.children) {
                        return { ...el, children: insertRecursive(el.children) };
                    }
                    return el;
                });
            };
            newElements = insertRecursive(newElements);
            newElements = newElements.map((el, i) => ({ ...el, order: i })); 
        }

        set({ elements: newElements, redoStack: [] });
      },

      undo: () => {
        const { undoStack, elements, redoStack } = get();
        if (undoStack.length === 0) return;

        const prev = undoStack[undoStack.length - 1];
        const newUndoStack = undoStack.slice(0, -1);

        set({
          elements: prev.elements,
          undoStack: newUndoStack,
          redoStack: [{ elements }, ...redoStack],
          selectedElementId: null,
        });
      },

      redo: () => {
        const { redoStack, elements, undoStack } = get();
        if (redoStack.length === 0) return;

        const next = redoStack[0];
        const newRedoStack = redoStack.slice(1);

        set({
          elements: next.elements,
          undoStack: [...undoStack, { elements }],
          redoStack: newRedoStack,
          selectedElementId: null,
        });
      },

      saveState: () => {
        const { elements, undoStack } = get();
        const newUndoStack = [...undoStack, { elements }].slice(-50);
        set({ undoStack: newUndoStack });
      },

      updateElementAnimation: (id, animation) => {
        const { elements } = get();
        set({
          elements: updateInTree(elements, id, (el) => ({
            ...el,
            animation: { ...el.animation, ...animation } as import("@/lib/types").AnimationConfig,
          })),
        });
      },

      updateElementHoverStyles: (id, hoverStyles) => {
        const { elements } = get();
        set({
          elements: updateInTree(elements, id, (el) => ({
            ...el,
            hoverStyles: { ...el.hoverStyles, ...hoverStyles },
          })),
        });
      },

      updateElementFocusStyles: (id, focusStyles) => {
        const { elements } = get();
        set({
          elements: updateInTree(elements, id, (el) => ({
            ...el,
            focusStyles: { ...el.focusStyles, ...focusStyles },
          })),
        });
      },

      updateElementActiveStyles: (id, activeStyles) => {
        const { elements } = get();
        set({
          elements: updateInTree(elements, id, (el) => ({
            ...el,
            activeStyles: { ...el.activeStyles, ...activeStyles },
          })),
        });
      },

      updateElementName: (id, name) => {
        const { elements } = get();
        set({ elements: updateInTree(elements, id, (el) => ({ ...el, name })) });
      },

      updateDescendantsStyles: (parentId, styles, targetType) => {
        const { elements } = get();
        get().saveState();

        const updateRecursive = (items: CanvasElement[]): CanvasElement[] => {
          return items.map((el) => {
            const isTarget = !targetType || el.type === targetType;
            const updatedEl = isTarget ? { ...el, styles: { ...el.styles, ...styles } } : el;
            if (updatedEl.children?.length) {
              return { ...updatedEl, children: updateRecursive(updatedEl.children) };
            }
            return updatedEl;
          });
        };

        set({
          elements: updateInTree(elements, parentId, (el) => ({
            ...el,
            children: el.children ? updateRecursive(el.children) : [],
          })),
          redoStack: [],
        });
      },

      duplicateElement: (id) => {
        const { elements } = get();
        const original = findInTree(elements, id);
        if (!original) return;
        get().saveState();
        const deepClone = (el: CanvasElement): CanvasElement => ({
          ...el,
          id: generateId(),
          name: el.name ? `${el.name} copy` : undefined,
          children: el.children?.map(deepClone),
        });
        const cloned = deepClone(original);
        const insertAt = original.order + 1;
        const shifted = elements.map((el) =>
          el.order >= insertAt ? { ...el, order: el.order + 1 } : el
        );
        set({ elements: [...shifted, { ...cloned, order: insertAt }], selectedElementId: cloned.id, redoStack: [] });
      },

      copyElement: (id) => {
        const { elements } = get();
        const el = findInTree(elements, id);
        if (el) set({ clipboard: el });
      },

      pasteElement: () => {
        const { clipboard, elements } = get();
        if (!clipboard) return;
        get().saveState();
        const deepClone = (el: CanvasElement): CanvasElement => ({
          ...el,
          id: generateId(),
          children: el.children?.map(deepClone),
        });
        const cloned = { ...deepClone(clipboard), order: elements.length };
        set({ elements: [...elements, cloned], selectedElementId: cloned.id, redoStack: [] });
      },

      toggleElementLock: (id) => {
        const { elements } = get();
        set({ elements: updateInTree(elements, id, (el) => ({ ...el, isLocked: !el.isLocked })) });
      },

      toggleElementVisibility: (id) => {
        const { elements } = get();
        set({ elements: updateInTree(elements, id, (el) => ({ ...el, isHidden: !el.isHidden })) });
      },

      setIsSaving: (saving) => {
        set({ isSaving: saving });
        if (!saving) {
          set({ lastSaved: new Date() });
        }
      },

      // ── Element runtime event bus ─────────────────────────────────────
      setElementState: (key, value) => {
        set((s) => ({ elementState: { ...s.elementState, [key]: value } }));
      },

      getElementState: (key) => get().elementState[key],

      broadcastElementEvent: (event, payload) => {
        const handlers = get()._elementEventHandlers[event];
        if (handlers) handlers.forEach((h) => h(payload));
      },

      onElementEvent: (event, handler) => {
        set((s) => ({
          _elementEventHandlers: {
            ...s._elementEventHandlers,
            [event]: [...(s._elementEventHandlers[event] ?? []), handler],
          },
        }));
        return () => {
          set((s) => ({
            _elementEventHandlers: {
              ...s._elementEventHandlers,
              [event]: (s._elementEventHandlers[event] ?? []).filter((h) => h !== handler),
            },
          }));
        };
      },

      setZoom: (zoom) => set({ zoom: Math.max(25, Math.min(200, zoom)) }),
      zoomIn: () => set((s) => ({ zoom: Math.min(200, s.zoom + 10) })),
      zoomOut: () => set((s) => ({ zoom: Math.max(25, s.zoom - 10) })),
      toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
      updateDesignTokens: (tokens) => set((s) => ({ designTokens: { ...s.designTokens, ...tokens } })),

      saveNamedSnapshot: (name) => {
        const { elements, namedSnapshots } = get();
        const snapshot: NamedSnapshot = { id: generateId(), name, elements: JSON.parse(JSON.stringify(elements)), createdAt: new Date() };
        set({ namedSnapshots: [...namedSnapshots, snapshot] });
      },

      restoreSnapshot: (id) => {
        const { namedSnapshots } = get();
        const snap = namedSnapshots.find((s) => s.id === id);
        if (!snap) return;
        get().saveState();
        set({ elements: snap.elements, selectedElementId: null, redoStack: [] });
      },

      deleteSnapshot: (id) => {
        const { namedSnapshots } = get();
        set({ namedSnapshots: namedSnapshots.filter((s) => s.id !== id) });
      },

      updatePageSEO: (seo) => {
        set((s) => ({ pageSEO: { ...s.pageSEO, ...seo } }));
      },
      updatePageCustomCSS: (css) => { set({ pageCustomCSS: css }); get().triggerAutoSave(); },
      updatePageCustomJS: (js) => { set({ pageCustomJS: js }); get().triggerAutoSave(); },
      updatePageCustomHTML: (html) => { set({ pageCustomHTML: html }); get().triggerAutoSave(); },
      updatePageResponsiveCSS: (bp, css) => { set((s) => ({ pageResponsiveCSS: { ...s.pageResponsiveCSS, [bp]: css } })); get().triggerAutoSave(); },

      wrapInContainer: (id) => {
        const { elements } = get();
        const el = findInTree(elements, id);
        if (!el) return;
        get().saveState();
        const wrapper: CanvasElement = {
          id: generateId(),
          type: "container",
          content: "",
          order: el.order,
          styles: { padding: "16px" },
          props: { _childLayout: "column" },
          children: [{ ...el, order: 0 }],
        };
        const replaced = elements.map((e) => e.id === id ? wrapper : e);
        set({ elements: replaced, selectedElementId: wrapper.id, redoStack: [] });
      },

      loadElements: (elements) => set({ elements, undoStack: [], redoStack: [] }),
      clearCanvas: () => {
        get().saveState();
        set({ elements: [], selectedElementId: null, redoStack: [] });
      },

      triggerAutoSave: () => {
        const { siteId, currentPageId, elements, pageSEO, pageCustomCSS, pageCustomJS, pageResponsiveCSS } = get();
        if (!siteId || !currentPageId) return;

        if (autoSaveTimer) clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(async () => {
          set({ isSaving: true, saveFailed: false });
          try {
            const { pageCustomHTML } = get();
            const payload = { content: elements, meta: pageSEO, customCSS: pageCustomCSS, customJS: pageCustomJS, customHTML: pageCustomHTML, responsiveCSS: pageResponsiveCSS };
            // Try PUT first; fall back to POST if the page doesn't exist yet (404)
            let res = await fetch(`/api/v1/sites/${siteId}/pages/${currentPageId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            if (res.status === 404) {
              res = await fetch(`/api/v1/sites/${siteId}/pages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: currentPageId, ...payload }),
              });
            }
            if (!res.ok) {
              set({ isSaving: false, saveFailed: true });
              return;
            }
            set({ isSaving: false, lastSaved: new Date(), saveFailed: false });
          } catch {
            set({ isSaving: false, saveFailed: true });
          }
        }, 2000);
      },
    });

export const useEditorStore = create<EditorStore>()(storeCreator);
