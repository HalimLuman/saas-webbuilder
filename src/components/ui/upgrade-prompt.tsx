"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UpgradePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  targetPlan?: string;
}

export function UpgradePrompt({ open, onOpenChange, title, description, targetPlan = "pro" }: UpgradePromptProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-2xl shadow-indigo-500/10 sm:rounded-2xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
              <Sparkles className="h-6 w-6 text-indigo-600" />
            </div>
            <Dialog.Close asChild>
              <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </Dialog.Close>
          </div>
          
          <div className="space-y-2 mt-2">
            <Dialog.Title className="text-xl font-bold tracking-tight text-gray-900">
              {title}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 leading-relaxed">
              {description}
            </Dialog.Description>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <Button variant="outline" className="w-full sm:w-auto font-semibold">
                Maybe later
              </Button>
            </Dialog.Close>
            <Button asChild className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700 shadow-md font-bold group">
              <Link href={`/dashboard/settings?upgrade=${targetPlan}`}>
                Upgrade to {targetPlan.charAt(0).toUpperCase() + targetPlan.slice(1)}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
