"use client";

import { useUserContext } from "@/lib/user-context";
import { PLAN_LIMITS, PlanLimits, PlanType } from "@/lib/plan-limits";
import { useMemo } from "react";

export function usePlanLimits() {
  const { profile, loading } = useUserContext();

  const plan = useMemo(() => {
    return profile?.plan || "free";
  }, [profile]);

  const limits = useMemo(() => {
    return PLAN_LIMITS[plan as PlanType] || PLAN_LIMITS.free;
  }, [plan]);

  const checkLimit = (
    type: keyof PlanLimits,
    currentCount: number
  ): { reached: boolean; limit: number } => {
    const limit = limits[type];
    if (typeof limit !== "number") {
      return { reached: false, limit: 0 };
    }
    return {
      reached: currentCount >= limit,
      limit,
    };
  };

  const isFeatureAllowed = (feature: keyof PlanLimits): boolean => {
    const allowed = limits[feature];
    return !!allowed;
  };

  return {
    plan,
    limits,
    loading,
    checkLimit,
    isFeatureAllowed,
  };
}
