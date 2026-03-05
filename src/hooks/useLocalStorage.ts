"use client";

import { useState, useEffect } from "react";

/**
 * A drop-in replacement for useState that persists to localStorage.
 * SSR-safe: reads from localStorage only after mount.
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [mounted, setMounted] = useState(false);

  // Read from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch {
      // Corrupt storage — silently fall back to default
    }
    setMounted(true);
  }, [key]);

  // Write to localStorage on every change (after mount)
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable — no-op
    }
  }, [key, value, mounted]);

  return [value, setValue] as const;
}
