import React from "react";
import Link from "next/link";
import Readout from "../Readout";
import RequestTrace from "../RequestTrace";

export default function Hero() {
  return (
    <section
      id="main"
      className="flex min-h-[100svh] flex-col justify-center pt-[4.5rem]"
    >
      <div className="mx-auto w-full max-w-[1240px] px-[var(--gutter)] py-16">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-6">
            <h1 className="settle text-[clamp(2.4rem,5.4vw,4.1rem)] font-semibold leading-[0.95] tracking-tightest">
              Whole systems, shipped end to end.
            </h1>

            <p className="settle-2 mt-8 max-w-measure text-base leading-relaxed text-dim md:text-lg">
              I shipped a job-application platform alone: product, backend,
              browser extension, scrapers, payments and the infrastructure under
              it. Now past 135,000 applications for 2,300 users in under three months. Alongside it: real-time trading interfaces in React,
              microservices rewritten in C++, and the Linux and CI/CD work to
              run them. I don&rsquo;t specialise in a layer. I take whatever the
              problem needs.
            </p>

            <div className="settle-3 mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="#work"
                className="border border-signal bg-signal px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-transparent hover:text-signal"
              >
                See the work
              </Link>
              <Link
                href="#contact"
                className="border border-rule px-5 py-3 text-sm text-dim transition-colors hover:border-text hover:text-text"
              >
                Get in touch
              </Link>
            </div>
          </div>

          <div className="settle-2 md:col-span-6 md:col-start-7">
            <RequestTrace />
            <dl className="-mt-px border border-rule bg-panel px-3 py-1">
              <Readout label="role" value="Software Engineer" />
              <Readout label="at" value="Finrise" live />
              <Readout label="building since" value="2021" />
              <Readout label="languages" value="TypeScript   C++   Python" />
              <Readout label="scope" value="product to infrastructure" />
            </dl>
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-dim2">
              A synthetic request, traced through the layers I work in. The
              timings are made up; owning all five rows is not.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
