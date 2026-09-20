"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ScrollProgress from "./ScrollProgress";

const navItems = [
  { title: "About", href: "#about", id: "about" },
  { title: "Experience", href: "#experience", id: "experience" },
  { title: "Work", href: "#work", id: "work" },
  { title: "Contact", href: "#contact", id: "contact" },
];

const RESUME = "/vivek chaturvedi resume.pdf";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // An open drawer has to behave like one: escape closes it, the page behind
  // stops scrolling, focus moves in, and focus comes back to the toggle after.
  useEffect(() => {
    if (!isMenuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    drawerRef.current?.querySelector<HTMLElement>("a")?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
      toggleRef.current?.focus();
    };
  }, [isMenuOpen]);

  // Which panel is on screen. Amber marks it — the one state worth a colour.
  useEffect(() => {
    const ids = [...navItems.map((i) => i.id), "main"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id === "main" ? null : visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
    <nav className="fixed top-0 z-50 w-full border-b border-rule bg-[var(--surface-nav)] backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[1240px] items-center justify-between px-[var(--gutter)]">
        <Link
          href="/#main"
          className="group flex items-baseline gap-3"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="font-medium tracking-tightest">Vivek Chaturvedi</span>
          <span className="hidden font-mono text-[11px] text-dim2 transition-colors group-hover:text-signal sm:inline">
            software engineer
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-3 text-sm transition-colors ${
                active === item.id ? "text-signal" : "text-dim hover:text-text"
              }`}
            >
              {item.title}
            </Link>
          ))}
          <Link
            href={RESUME}
            target="_blank"
            className="ml-3 border border-rule px-3.5 py-2.5 font-mono text-xs text-text transition-colors hover:border-signal hover:text-signal"
          >
            Résumé
          </Link>
        </div>

        <button
          ref={toggleRef}
          data-js-only
          className="relative z-50 -mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span
            className={`h-px w-5 bg-text transition-transform duration-300 ${
              isMenuOpen ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-5 bg-text transition-opacity duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-px w-5 bg-text transition-transform duration-300 ${
              isMenuOpen ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <ScrollProgress />
    </nav>

      <div
        aria-hidden
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-[var(--scrim)] transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="mobile-menu"
        ref={drawerRef}
        inert={!isMenuOpen}
        className={`fixed right-0 top-0 z-40 h-[100dvh] w-[78%] max-w-xs border-l border-rule bg-panel px-[var(--gutter)] pt-28 transition-transform duration-300 ease-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-start">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-full border-b border-rule py-4 text-lg transition-colors hover:text-signal"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.title}
            </Link>
          ))}
          <Link
            href={RESUME}
            target="_blank"
            className="mt-8 border border-rule px-4 py-2 font-mono text-xs transition-colors hover:border-signal hover:text-signal"
            onClick={() => setIsMenuOpen(false)}
          >
            Résumé
          </Link>
        </div>
      </div>
    </>
  );
}
