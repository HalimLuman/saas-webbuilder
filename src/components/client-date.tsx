"use client";

/**
 * Renders a formatted date only on the client.
 *
 * toLocaleDateString() is locale/timezone-sensitive: the server (UTC) can
 * produce a different string than the browser, causing React hydration errors.
 * This component suppresses the mismatch by pinning the server output to an
 * empty string and letting the client fill in the real value after mount.
 *
 * Usage:
 *   <ClientDate date={site.updated_at} />
 *   <ClientDate date={site.updated_at} options={{ month: "short", day: "numeric" }} />
 */

interface ClientDateProps {
  date: string | Date | null | undefined;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
  fallback?: string;
  className?: string;
}

export function ClientDate({
  date,
  locale = "en-US",
  options = { month: "short", day: "numeric", year: "numeric" },
  fallback = "—",
  className,
}: ClientDateProps) {
  if (!date) return <span className={className}>{fallback}</span>;

  const formatted = new Date(date).toLocaleDateString(locale, options);

  return (
    // suppressHydrationWarning lets React skip the server/client text diff
    // for this single element. The server emits an empty string; the client
    // immediately writes the real date without an error or visible flash.
    <span className={className} suppressHydrationWarning>
      {formatted}
    </span>
  );
}
