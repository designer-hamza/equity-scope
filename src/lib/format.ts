/** Presentation-only formatting helpers. No financial logic lives here. */

export function formatCurrencyCompact(value: number, currency = "USD"): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const symbol = currency === "USD" ? "$" : "";
  if (abs >= 1e12) return `${sign}${symbol}${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}${symbol}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${symbol}${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}${symbol}${(abs / 1e3).toFixed(1)}K`;
  return `${sign}${symbol}${abs.toFixed(2)}`;
}

export function formatNumberCompact(value: number): string {
  return formatCurrencyCompact(value, "");
}

export function formatPrice(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, digits = 1, withSign = false): string {
  const sign = withSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatMultiple(value: number, digits = 1): string {
  return `${value.toFixed(digits)}x`;
}

export function formatRatio(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function formatInteger(value: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

/** Statement line items are stored in millions of the reporting currency. */
export function formatStatementValue(millions: number): string {
  const sign = millions < 0 ? "-" : "";
  const abs = Math.abs(millions);
  return `${sign}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(abs)}`;
}
