"use client";

import { useEffect, useRef } from "react";

/**
 * A finer grid that only exists where the pointer is. Position is written to CSS
 * custom properties inside one rAF — no React state, so nothing re-renders as
 * the mouse moves (the old mouse-tracking blob re-rendered on every event).
 */
export default function CursorField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let x = 0;
    let y = 0;
    let queued = false;

    const paint = () => {
      queued = false;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!queued) {
        queued = true;
        requestAnimationFrame(paint);
      }
      el.style.setProperty("--on", "1");
    };

    const onLeave = () => el.style.setProperty("--on", "0");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} aria-hidden className="cursor-field" />;
}
