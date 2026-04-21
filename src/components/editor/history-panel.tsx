"use client";

import React, { useState } from "react";
import { Clock, Save, RotateCcw, Trash2, Plus } from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function HistoryPanel() {
  const { namedSnapshots, saveNamedSnapshot, restoreSnapshot, deleteSnapshot, undoStack } = useEditorStore();
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);

  function handleSave() {
    const name = nameInput.trim() || `Checkpoint ${namedSnapshots.length + 1}`;
    saveNamedSnapshot(name);
    setNameInput("");
    setSaving(false);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold text-gray-800">Version History</span>
        </div>

        {/* Save new checkpoint */}
        {saving ? (
          <div className="flex gap-1.5">
            <input
              autoFocus
              className="flex-1 text-[11px] px-2 py-1.5 rounded border border-indigo-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
              placeholder="Checkpoint name..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setSaving(false);
              }}
            />
            <button
              onClick={handleSave}
              className="px-2.5 py-1.5 text-[11px] bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setSaving(false)}
              className="px-2 py-1.5 text-[11px] text-gray-500 hover:text-gray-700 rounded border border-gray-200"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSaving(true)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Save Checkpoint
          </button>
        )}
      </div>

      {/* Snapshot list */}
      <div className="flex-1 overflow-y-auto">
        {namedSnapshots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400 gap-2">
            <Save className="w-5 h-5 opacity-40" />
            <span className="text-[11px]">No checkpoints saved yet</span>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {[...namedSnapshots].reverse().map((snap) => (
              <div
                key={snap.id}
                className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 group"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-gray-800 truncate">{snap.name}</div>
                  <div className="text-[10px] text-gray-400">{timeAgo(snap.createdAt)}</div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => restoreSnapshot(snap.id)}
                    title="Restore"
                    className="p-1 rounded hover:bg-indigo-100 text-indigo-600 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteSnapshot(snap.id)}
                    title="Delete"
                    className="p-1 rounded hover:bg-red-100 text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Auto history divider */}
        {undoStack.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Auto History</div>
            <div className="text-[11px] text-gray-500">{undoStack.length} unsaved step{undoStack.length !== 1 ? "s" : ""} (use Ctrl+Z to undo)</div>
          </div>
        )}
      </div>
    </div>
  );
}
