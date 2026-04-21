"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Search, Replace, X, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useEditorStore, findInTree } from "@/store/editor-store";
import { cn } from "@/lib/utils";
import type { CanvasElement } from "@/lib/types";

// ---------------------------------------------------------------------------
// Flatten + search
// ---------------------------------------------------------------------------

function flattenElements(elements: CanvasElement[]): CanvasElement[] {
  const result: CanvasElement[] = [];
  function walk(els: CanvasElement[]) {
    for (const el of els) {
      result.push(el);
      if (el.children?.length) walk(el.children);
    }
  }
  walk(elements);
  return result;
}

function getSearchableText(el: CanvasElement): string {
  const parts: string[] = [];
  if (el.content) parts.push(el.content);
  if (el.props) {
    for (const val of Object.values(el.props)) {
      if (typeof val === "string") parts.push(val);
    }
  }
  return parts.join(" ");
}

interface SearchResult {
  elementId: string;
  elementType: string;
  field: "content" | "props";
  fieldKey?: string;
  preview: string;
  matchStart: number;
  matchEnd: number;
}

function findMatches(elements: CanvasElement[], query: string, caseSensitive: boolean): SearchResult[] {
  if (!query.trim()) return [];
  const flat = flattenElements(elements);
  const results: SearchResult[] = [];
  const flags = caseSensitive ? "g" : "gi";
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, flags);

  for (const el of flat) {
    // Check content
    if (el.content) {
      const matches = Array.from(el.content.matchAll(regex));
      for (const m of matches) {
        results.push({
          elementId: el.id,
          elementType: el.type,
          field: "content",
          preview: el.content,
          matchStart: m.index ?? 0,
          matchEnd: (m.index ?? 0) + query.length,
        });
      }
    }
    // Check props
    if (el.props) {
      for (const [key, val] of Object.entries(el.props)) {
        if (typeof val === "string") {
          const matches = Array.from(val.matchAll(regex));
          for (const m of matches) {
            results.push({
              elementId: el.id,
              elementType: el.type,
              field: "props",
              fieldKey: key,
              preview: val,
              matchStart: m.index ?? 0,
              matchEnd: (m.index ?? 0) + query.length,
            });
          }
        }
      }
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Highlight helper
// ---------------------------------------------------------------------------

function HighlightedText({ text, start, end }: { text: string; start: number; end: number }) {
  const before = text.slice(0, start);
  const match = text.slice(start, end);
  const after = text.slice(end);
  const maxLen = 60;
  const preview = text.length > maxLen
    ? `...${text.slice(Math.max(0, start - 15), Math.min(text.length, end + 20))}...`
    : text;
  const adjStart = text.length > maxLen ? Math.min(15, start) : start;
  const adjEnd = adjStart + match.length;

  return (
    <span className="text-[10px] text-gray-600 font-mono">
      {preview.slice(0, adjStart)}
      <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">{preview.slice(adjStart, adjEnd)}</mark>
      {preview.slice(adjEnd)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface FindReplaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FindReplace({ isOpen, onClose }: FindReplaceProps) {
  const { elements, selectElement, updateElementContent, updateElementProps } = useEditorStore();
  const [query, setQuery] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [showReplace, setShowReplace] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [replaced, setReplaced] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = findMatches(elements, query, caseSensitive);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setReplaced([]);
      setCurrentIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setCurrentIndex(0);
    setReplaced([]);
  }, [query, caseSensitive]);

  const goToResult = useCallback((index: number) => {
    const r = results[index];
    if (!r) return;
    selectElement(r.elementId);
    setCurrentIndex(index);
  }, [results, selectElement]);

  const goPrev = () => {
    const idx = (currentIndex - 1 + results.length) % results.length;
    goToResult(idx);
  };

  const goNext = () => {
    const idx = (currentIndex + 1) % results.length;
    goToResult(idx);
  };

  const replaceOne = () => {
    const r = results[currentIndex];
    if (!r) return;
    const el = findInTree(elements, r.elementId);
    if (!el) return;
    const flags = caseSensitive ? "g" : "gi";
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, flags);
    if (r.field === "content") {
      const newContent = (el.content || "").replace(regex, replaceText);
      updateElementContent(r.elementId, newContent);
    } else if (r.field === "props" && r.fieldKey) {
      const val = (el.props?.[r.fieldKey] as string) || "";
      updateElementProps(r.elementId, { [r.fieldKey]: val.replace(regex, replaceText) });
    }
    setReplaced((prev) => [...prev, r.elementId + (r.fieldKey || "content")]);
  };

  const replaceAll = () => {
    const flags = caseSensitive ? "g" : "gi";
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, flags);
    const newReplaced: string[] = [];

    // Group by element
    const byElement = new Map<string, SearchResult[]>();
    for (const r of results) {
      if (!byElement.has(r.elementId)) byElement.set(r.elementId, []);
      byElement.get(r.elementId)!.push(r);
    }

    for (const [elementId, rs] of Array.from(byElement.entries())) {
      const el = findInTree(elements, elementId);
      if (!el) continue;
      // Replace content
      if (rs.some((r) => r.field === "content") && el.content) {
        updateElementContent(elementId, el.content.replace(regex, replaceText));
        newReplaced.push(elementId + "content");
      }
      // Replace props
      const propKeys = Array.from(new Set(rs.filter((r: SearchResult) => r.field === "props").map((r: SearchResult) => r.fieldKey!)));
      const propUpdates: Record<string, unknown> = {};
      for (const key of propKeys) {
        const val = (el.props?.[key] as string) || "";
        propUpdates[key] = val.replace(regex, replaceText);
        newReplaced.push(elementId + key);
      }
      if (Object.keys(propUpdates).length) updateElementProps(elementId, propUpdates);
    }
    setReplaced(newReplaced);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[480px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-800">Find & Replace</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400">
            {results.length > 0 ? `${currentIndex + 1} of ${results.length}` : `${results.length} results`}
          </span>
          <button onClick={onClose} className="h-6 w-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Find input */}
        <div className="space-y-1.5">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-3.5 h-3.5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) goNext();
                if (e.key === "Enter" && e.shiftKey) goPrev();
                if (e.key === "Escape") onClose();
              }}
              placeholder="Find text…"
              className="w-full pl-9 pr-24 py-2 text-[12px] rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {/* Case sensitive toggle */}
              <button
                onClick={() => setCaseSensitive(!caseSensitive)}
                title="Case sensitive"
                className={cn(
                  "h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold transition-colors",
                  caseSensitive ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >Aa</button>
              {/* Navigation */}
              <button onClick={goPrev} disabled={results.length === 0} className="h-6 w-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors">
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button onClick={goNext} disabled={results.length === 0} className="h-6 w-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors">
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Replace toggle */}
        <button
          onClick={() => setShowReplace(!showReplace)}
          className="flex items-center gap-1 text-[11px] text-indigo-600 font-medium hover:text-indigo-800"
        >
          <Replace className="w-3 h-3" />
          {showReplace ? "Hide replace" : "Show replace"}
        </button>

        {showReplace && (
          <div className="space-y-2">
            <div className="relative">
              <Replace className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Replace with…"
                className="w-full pl-9 pr-3 py-2 text-[12px] rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={replaceOne}
                disabled={results.length === 0}
                className="flex-1 py-1.5 text-[11px] font-medium bg-white border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 disabled:opacity-30 transition-colors"
              >
                Replace
              </button>
              <button
                onClick={replaceAll}
                disabled={results.length === 0}
                className="flex-1 py-1.5 text-[11px] font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-30 transition-colors"
              >
                Replace All
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {query.trim() && (
          <div className="space-y-1 max-h-48 overflow-y-auto border-t border-gray-100 pt-3">
            {results.length === 0 ? (
              <p className="text-[11px] text-gray-400 text-center py-3">No matches found</p>
            ) : (
              results.map((r, i) => (
                <button
                  key={`${r.elementId}-${r.fieldKey || "content"}-${r.matchStart}`}
                  onClick={() => goToResult(i)}
                  className={cn(
                    "w-full flex items-start gap-2 px-3 py-2 rounded-lg text-left transition-colors",
                    i === currentIndex ? "bg-indigo-50 border border-indigo-200" : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-gray-500 capitalize">{r.elementType}</span>
                      {r.fieldKey && <span className="text-[9px] text-gray-400">· {r.fieldKey}</span>}
                      {replaced.includes(r.elementId + (r.fieldKey || "content")) && (
                        <Check className="w-3 h-3 text-emerald-500 ml-auto" />
                      )}
                    </div>
                    <HighlightedText text={r.preview} start={r.matchStart} end={r.matchEnd} />
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
