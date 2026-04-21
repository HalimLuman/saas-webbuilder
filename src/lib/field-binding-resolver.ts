/**
 * FieldBinding Resolver — v2 Backend Action System
 *
 * Resolves a FieldBinding to a concrete runtime value given the request context.
 * Used by the action executor, route runner, and data source query executor.
 */

import type { FieldBinding } from "./types";

export interface ResolverContext {
  /** Parsed form / request body (key-value pairs) */
  formData?: Record<string, unknown>;
  /** Authenticated end-user record (from Supabase auth or site auth) */
  authUser?: Record<string, unknown> | null;
  /** URL path and query parameters */
  urlParams?: Record<string, string | string[]>;
  /** Current element runtime state map (elementId:key → value) */
  elementState?: Record<string, unknown>;
}

/**
 * Resolve a single FieldBinding to its runtime value.
 */
export function resolveFieldBinding(
  binding: FieldBinding,
  ctx: ResolverContext
): unknown {
  switch (binding.source) {
    case "formField":
      return ctx.formData?.[binding.field] ?? null;

    case "auth.user":
      return ctx.authUser?.[binding.field] ?? null;

    case "urlParam": {
      const val = ctx.urlParams?.[binding.param];
      if (Array.isArray(val)) return val[0] ?? null;
      return val ?? null;
    }

    case "literal":
      return binding.value;

    case "elementState": {
      const key = `${binding.elementId}:${binding.key}`;
      return ctx.elementState?.[key] ?? null;
    }

    default:
      return null;
  }
}

/**
 * Resolve an entire object of field bindings or literal values.
 * Values that are FieldBinding objects are resolved; plain values are passed through.
 */
export function resolveBindingMap(
  map: Record<string, FieldBinding | unknown>,
  ctx: ResolverContext
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(map)) {
    if (isFieldBinding(value)) {
      result[key] = resolveFieldBinding(value as FieldBinding, ctx);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function isFieldBinding(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.source === "string" &&
    ["formField", "auth.user", "urlParam", "literal", "elementState"].includes(v.source)
  );
}
