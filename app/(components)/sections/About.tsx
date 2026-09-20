import React from "react";
import Panel from "../Panel";

/** Grouped by layer, because the breadth is the point. */
const layers = [
  { layer: "product", items: "React   Next.js   Redux   WebSockets" },
  { layer: "services", items: "Node.js   Express   Python   Django   C++" },
  { layer: "data", items: "PostgreSQL   pgvector   Redis   MongoDB" },
  { layer: "platform", items: "AWS   Docker   Nginx   Jenkins" },
];

export default function About() {
  return (
    <Panel id="about" title="About">
      <div className="mt-10 grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="space-y-5 md:col-span-6">
          <p className="max-w-measure leading-relaxed text-dim">
            I build software end to end. Most recently that meant ApplyCove: a
            job-application automation platform I designed, built and shipped
            alone: product decisions and visual design through to the API,
            the Postgres schema, a browser extension, six ATS scrapers, payments
            across three gateways, and the infrastructure it all runs on.
          </p>
          <p className="max-w-measure leading-relaxed text-dim">
            Shipping alone meant owning the calls outside the code as well: what
            to build first and what to cut, pricing and onboarding, what had to
            be right before launch and what could wait until after it. Idea,
            build, ship, market. I&rsquo;ve run the whole loop. Building is
            still the part I reach for.
          </p>

          <p className="max-w-measure leading-relaxed text-dim">
            The rest of my work runs the same way. At Finrise I built a real-time
            risk management system in React and rewrote backend microservices in
            C++. Before that: WebSocket dashboards, Django APIs, and the Linux,
            Nginx, Docker and CI/CD work to deploy them. I&rsquo;m comfortable
            being the only engineer on a problem, and comfortable being one of
            many.
          </p>
          <p className="max-w-measure leading-relaxed text-dim">
            I don&rsquo;t think of myself as a frontend engineer or a backend
            engineer. I pick up whatever the system is short of.
          </p>
        </div>

        <div className="md:col-span-5 md:col-start-8">
          <p className="border-b border-rule pb-2 font-mono text-[11px] text-dim2">
            Where I work, by layer
          </p>
          <dl>
            {layers.map((row) => (
              <div key={row.layer} className="border-b border-rule py-3">
                <dt className="font-mono text-[11px] text-dim2">{row.layer}</dt>
                <dd className="mt-1.5 font-mono text-sm leading-relaxed">
                  {row.items}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Panel>
  );
}
