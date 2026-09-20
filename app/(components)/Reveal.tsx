"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One observer for the whole page, so sections stay server components and just
 * carry `data-reveal`.
 *
 * Re-queries on every route change: Next swaps the page's DOM without
 * remounting the layout, so a single mount-time query would leave every
 * client-navigated page's content stuck at opacity 0.
 */
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(
      "[data-reveal]:not([data-shown])"
    );
    if (els.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.setAttribute("data-shown", ""));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-shown", "");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
