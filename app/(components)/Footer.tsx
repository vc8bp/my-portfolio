import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-[var(--gutter)] py-10 font-mono text-xs text-dim2 sm:flex-row sm:items-center sm:justify-between">
        <p>Designed and built by Vivek Chaturvedi</p>
        <nav aria-label="Sections" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/#about" className="transition-colors hover:text-signal">About</Link>
          <Link href="/#experience" className="transition-colors hover:text-signal">Experience</Link>
          <Link href="/#work" className="transition-colors hover:text-signal">Work</Link>
          <Link href="/#contact" className="transition-colors hover:text-signal">Contact</Link>
        </nav>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a
            href="https://github.com/vc8bp/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-signal"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/vivek-chaturvedi903/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-signal"
          >
            LinkedIn
          </a>
          <Link href="/archive" className="transition-colors hover:text-signal">
            Archive
          </Link>
        </div>
      </div>
    </footer>
  );
}
