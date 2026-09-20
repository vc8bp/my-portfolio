import React from "react";

/**
 * Section shell. The heading rule draws itself as the panel comes into view.
 * A readout appears only where the data actually contains a count.
 */
export default function Panel({
  id,
  title,
  readout,
  children,
  className = "",
}: {
  id?: string;
  title: string;
  readout?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`border-t border-rule ${className}`}>
      <div className="mx-auto w-full max-w-[1240px] px-[var(--gutter)] py-20 md:py-28">
        <header>
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pb-4">
            <h2
              data-reveal="fade"
              className="text-2xl font-medium tracking-tightest md:text-3xl"
            >
              {title}
            </h2>
            {readout && (
              <p
                data-reveal="fade"
                style={{ ["--i" as string]: 1 }}
                className="tnum font-mono text-xs text-dim"
              >
                {readout}
              </p>
            )}
          </div>
          <span data-reveal="rule" className="block h-px w-full bg-rule" />
        </header>
        {children}
      </div>
    </section>
  );
}
