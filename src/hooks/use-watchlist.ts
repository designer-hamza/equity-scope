import { useCallback, useEffect, useState } from "react";
import { DEMO_DEFAULT_WATCHLIST } from "@/data/demo-companies";

/**
 * Client-side watchlist store. Persisted in localStorage for the prototype;
 * swap the read/write calls for authenticated database queries later.
 */
const STORAGE_KEY = "equityscope.watchlist";

function read(): string[] {
  if (typeof window === "undefined") return DEMO_DEFAULT_WATCHLIST;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEMO_DEFAULT_WATCHLIST;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : DEMO_DEFAULT_WATCHLIST;
  } catch {
    return DEMO_DEFAULT_WATCHLIST;
  }
}

const listeners = new Set<(v: string[]) => void>();

function broadcast(next: string[]) {
  listeners.forEach((l) => l(next));
}

export function useWatchlist() {
  const [tickers, setTickers] = useState<string[]>(DEMO_DEFAULT_WATCHLIST);

  useEffect(() => {
    setTickers(read());
    const listener = (v: string[]) => setTickers(v);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const persist = useCallback((next: string[]) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    broadcast(next);
  }, []);

  const add = useCallback(
    (ticker: string) => {
      const next = Array.from(new Set([...read(), ticker.toUpperCase()]));
      persist(next);
    },
    [persist],
  );

  const remove = useCallback(
    (ticker: string) => {
      persist(read().filter((t) => t !== ticker.toUpperCase()));
    },
    [persist],
  );

  const toggle = useCallback(
    (ticker: string) => {
      const current = read();
      if (current.includes(ticker.toUpperCase())) remove(ticker);
      else add(ticker);
    },
    [add, remove],
  );

  const has = useCallback((ticker: string) => tickers.includes(ticker.toUpperCase()), [tickers]);

  return { tickers, add, remove, toggle, has };
}
