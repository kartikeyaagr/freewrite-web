"use client";

import { useState, useEffect, useRef } from "react";

const DURATION_MS = 15 * 60 * 1000; // 15 minutes

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function useCountdown() {
  const [remaining, setRemaining] = useState(DURATION_MS);
  const [running, setRunning] = useState(false);
  const endTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  function tick() {
    if (endTimeRef.current === null) return;
    const left = endTimeRef.current - Date.now();
    if (left <= 0) {
      setRemaining(0);
      setRunning(false);
      endTimeRef.current = null;
      return;
    }
    setRemaining(left);
    rafRef.current = requestAnimationFrame(tick);
  }

  function start() {
    endTimeRef.current = Date.now() + remaining;
    setRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }

  function pause() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setRunning(false);
    endTimeRef.current = null;
  }

  function reset() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setRunning(false);
    endTimeRef.current = null;
    setRemaining(DURATION_MS);
  }

  function toggle() {
    if (remaining === 0) {
      reset();
      return;
    }
    running ? pause() : start();
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    display: formatCountdown(remaining),
    running,
    finished: remaining === 0,
    toggle,
    reset,
  };
}
