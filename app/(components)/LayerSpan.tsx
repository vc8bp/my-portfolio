import React from "react";

/**
 * Which layers a project actually reached, derived from its own technology
 * list. The four layers are the same four the About panel declares, so a reader
 * can see at a glance which projects span the whole stack and which sit in one
 * place. Replaces a decorative waveform with something that is true.
 */

const LAYERS = ["product", "services", "data", "platform"] as const;
type Layer = (typeof LAYERS)[number];

const MATCHES: Record<Layer, string[]> = {
  product: [
    "react", "next.js", "redux", "scss", "css", "html", "canvas", "material-ui",
    "ag grid", "chart.js", "echarts", "astro", "manifest", "javascript",
  ],
  services: [
    "node", "express", "django", "python", "c++", "websocket", "puppeteer",
    "llm", "boost", "multithreading", "shared memory", "ipc", "posix",
    "dynamic linking", "asynchronous", "low-latency", "modular architecture",
  ],
  data: ["postgres", "mongodb", "redis", "pgvector", "prisma", "sql"],
  platform: ["aws", "docker", "cloudflare", "nginx", "jenkins", "ci/cd", "fargate"],
};

export function layersFor(technologies: string[]): Layer[] {
  const lower = technologies.map((t) => t.toLowerCase());
  return LAYERS.filter((layer) =>
    MATCHES[layer].some((needle) => lower.some((t) => t.includes(needle)))
  );
}

export default function LayerSpan({ technologies }: { technologies: string[] }) {
  const hit = layersFor(technologies);
  const label = `Spans ${hit.length} of ${LAYERS.length} layers: ${hit.join(", ")}`;

  return (
    <div className="flex flex-col gap-2" aria-label={label} role="img">
      <div className="flex gap-1">
        {LAYERS.map((layer) => {
          const on = hit.includes(layer);
          return (
            <span
              key={layer}
              className={`h-1.5 w-8 transition-colors duration-300 ${
                on ? "bg-dim2 group-hover/row:bg-signal" : "bg-rule"
              }`}
            />
          );
        })}
      </div>
      <span className="tnum font-mono text-[10px] text-dim2">
        {hit.length} of {LAYERS.length} layers
      </span>
    </div>
  );
}
