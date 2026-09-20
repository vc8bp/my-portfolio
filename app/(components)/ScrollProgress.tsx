"use client";

import { useEffect, useRef } from "react";

/** How far down the document you are, as a hairline under the nav. */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let queued = false;

    const paint = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };

    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(paint);
      }
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute bottom-0 left-0 h-px w-full origin-left bg-signal"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
