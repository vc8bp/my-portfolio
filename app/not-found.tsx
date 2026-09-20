import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found | Vivek Chaturvedi",
  robots: { index: false, follow: true },
};

/**
 * The 404 reuses the hero instrument's language, because a missing page really
 * is a request that got partway and stopped. Static DOM — an error page should
 * not ship a canvas or an animation loop.
 */
const HOPS = [
  { key: "browser", tech: "React", status: "ok", reached: true },
  { key: "edge", tech: "Nginx", status: "ok", reached: true },
  { key: "api", tech: "Express", status: "no route", reached: false },
];

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col justify-center pt-[4.5rem]">
      <div className="mx-auto w-full max-w-[1240px] px-[var(--gutter)] py-16">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-6">
            <h1 className="text-[clamp(2.4rem,5.4vw,4.1rem)] font-semibold leading-[0.95] tracking-tightest">
              That page isn&rsquo;t here.
            </h1>
            <p className="mt-8 max-w-measure leading-relaxed text-dim">
              The link may be old, or the page may have moved. Everything that
              does exist is one click away.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="border border-signal bg-signal px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-transparent hover:text-signal"
              >
                Back to home
              </Link>
              <Link
                href="/#work"
                className="border border-rule px-5 py-3 text-sm text-dim transition-colors hover:border-text hover:text-text"
              >
                See the work
              </Link>
              <Link
                href="/archive"
                className="border border-rule px-5 py-3 text-sm text-dim transition-colors hover:border-text hover:text-text"
              >
                Archive
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <div className="border border-rule bg-panel">
              <div className="flex items-center justify-between border-b border-rule px-3 py-2">
                <span className="font-mono text-[11px] text-dim">
                  request trace
                </span>
                <span className="font-mono text-[11px] text-signal">404</span>
              </div>

              <ul className="px-3 py-1">
                {HOPS.map((hop, i) => (
                  <li
                    key={hop.key}
                    className="flex items-center gap-3 border-b border-rule py-3 last:border-b-0"
                  >
                    <span
                      aria-hidden
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        hop.reached
                          ? "bg-signal"
                          : "border border-rule bg-transparent"
                      }`}
                    />
                    <span
                      className={`w-[68px] shrink-0 font-mono text-[11px] ${
                        hop.reached ? "text-text" : "text-dim2"
                      }`}
                    >
                      {hop.key}
                    </span>
                    <span
                      aria-hidden
                      className={`h-px flex-1 ${
                        hop.reached ? "bg-dim2" : "bg-rule"
                      }`}
                      style={hop.reached ? undefined : { opacity: 0.6 }}
                    />
                    <span className="hidden font-mono text-[10px] text-dim2 sm:inline">
                      {hop.tech}
                    </span>
                    <span
                      className={`w-[62px] shrink-0 text-right font-mono text-[11px] ${
                        hop.reached ? "text-dim2" : "text-signal"
                      }`}
                    >
                      {hop.status}
                    </span>
                    <span className="sr-only">
                      {i === HOPS.length - 1
                        ? "the request stopped here"
                        : "reached"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-dim2">
              The request reached the server. There is just nothing at that
              address.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
