"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero instrument: one request, traced through every layer of a system.
 *
 * Not a metrics dashboard and not a market feed — it is the span view you get
 * from a tracer, and it is here because owning all five of these rows is the
 * claim this page makes. The timings are synthetic and the panel says so; what
 * is real is a browser drawing the whole path live.
 *
 * Layout note: the canvas owns only the middle column. Labels and timings are
 * real DOM either side of it, so nothing is drawn over text.
 */

const LAYERS = [
  { key: "browser", tech: "React", min: 2, max: 5 },
  { key: "edge", tech: "Nginx", min: 1, max: 3 },
  { key: "api", tech: "Express", min: 7, max: 17 },
  { key: "cache", tech: "Redis", min: 0.3, max: 2 },
  { key: "database", tech: "Postgres", min: 6, max: 15 },
];

const DB = LAYERS.length - 1;
const SPEED = 26; // real milliseconds per simulated millisecond
const HOLD = 520; // real milliseconds the finished trace stays up

type Shot = { spans: number[]; cacheHit: boolean; total: number };

function nextShot(): Shot {
  // A cache hit skips the database entirely. That asymmetry is the only reason
  // to draw a cache row at all.
  const cacheHit = Math.random() < 0.4;
  const spans = LAYERS.map((l, i) =>
    i === DB && cacheHit ? 0 : l.min + Math.random() * (l.max - l.min)
  );
  return { spans, cacheHit, total: spans.reduce((a, b) => a + b, 0) };
}

export default function RequestTrace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [fps, setFps] = useState(0);
  const [shot, setShot] = useState<Shot>(() => ({
    spans: LAYERS.map(() => 0),
    cacheHit: false,
    total: 0,
  }));
  const [done, setDone] = useState(-1); // index of the last completed layer

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!canvas || !box) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = box.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const css = getComputedStyle(document.documentElement);
    const signal = css.getPropertyValue("--signal").trim() || "#ffb020";
    const rule = css.getPropertyValue("--rule").trim() || "#2a2f36";
    const dim2 = css.getPropertyValue("--dim-2").trim() || "#7b828c";

    let running = true;
    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(box);

    let current = nextShot();
    let startedAt = performance.now();
    let lastReported = -2;
    setShot(current);

    const paint = (now: number) => {
      const simT = (now - startedAt) / SPEED;
      const finished = simT >= current.total;

      // which layer the request is inside right now
      let activeIdx = LAYERS.length - 1;
      let activeProgress = 1;
      let elapsed = 0;
      for (let i = 0; i < LAYERS.length; i++) {
        const span = current.spans[i];
        if (simT < elapsed + span) {
          activeIdx = i;
          activeProgress = span > 0 ? (simT - elapsed) / span : 1;
          break;
        }
        elapsed += span;
      }
      if (finished) {
        activeIdx = LAYERS.length;
        activeProgress = 1;
      }

      ctx.clearRect(0, 0, w, h);

      const rowH = h / LAYERS.length;
      const spineX = 9;
      const trackL = spineX + 14;
      const trackR = w - 6;
      const full = Math.max(0, trackR - trackL);
      const yOf = (i: number) => i * rowH + rowH / 2;

      // the path, drawn as far as the request has travelled
      ctx.strokeStyle = rule;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(spineX + 0.5, yOf(0));
      ctx.lineTo(spineX + 0.5, yOf(LAYERS.length - 1));
      ctx.stroke();

      const reachedY = yOf(Math.min(activeIdx, LAYERS.length - 1));
      ctx.strokeStyle = signal;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(spineX + 0.5, yOf(0));
      ctx.lineTo(spineX + 0.5, reachedY);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Spans cascade by start time, the way a tracer draws them — each row
      // begins where the row above handed off, not at a shared left edge.
      let offset = 0;
      LAYERS.forEach((_, i) => {
        const y = yOf(i);
        const span = current.spans[i];
        const skipped = span === 0;
        const isActive = i === activeIdx && !finished;
        const complete = i < activeIdx;
        const scale = current.total > 0 ? full / current.total : 0;

        // node on the spine
        ctx.beginPath();
        ctx.arc(spineX + 0.5, y, 3, 0, Math.PI * 2);
        if (skipped) {
          ctx.strokeStyle = rule;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fillStyle = complete || isActive ? signal : rule;
          ctx.fill();
        }

        // rail across the whole window
        ctx.fillStyle = rule;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(trackL, y - 0.5, full, 1);
        ctx.globalAlpha = 1;

        // a span the request has not reached yet draws nothing but its rail
        const pending = i > activeIdx && !finished;
        if (skipped || pending) {
          offset += span;
          return;
        }

        const barX = trackL + offset * scale;
        const barW = Math.max(4, span * scale);
        const shown =
          complete || finished ? barW : barW * Math.max(0, Math.min(1, activeProgress));

        // leader from the spine to where this span actually begins
        if (barX > trackL + 1 && (complete || isActive || finished)) {
          ctx.strokeStyle = signal;
          ctx.globalAlpha = 0.28;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(trackL, y + 0.5);
          ctx.lineTo(barX, y + 0.5);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        ctx.fillStyle = isActive ? signal : dim2;
        ctx.globalAlpha = isActive ? 1 : 0.8;
        ctx.fillRect(barX, y - 2, shown, 4);
        ctx.globalAlpha = 1;

        if (isActive) {
          ctx.beginPath();
          ctx.arc(barX + shown, y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = signal;
          ctx.fill();
          ctx.globalAlpha = 0.22;
          ctx.beginPath();
          ctx.arc(barX + shown, y, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        offset += span;
      });

      // tell React only when a row completes, not on every frame
      const reportIdx = finished ? LAYERS.length - 1 : activeIdx - 1;
      if (reportIdx !== lastReported) {
        lastReported = reportIdx;
        setDone(reportIdx);
      }

      if (finished && now - startedAt > current.total * SPEED + HOLD) {
        current = nextShot();
        startedAt = now;
        lastReported = -2;
        setShot(current);
        setDone(-1);
      }
    };

    let raf = 0;
    let frames = 0;
    let fpsClock = performance.now();

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!running) return;
      paint(now);
      frames++;
      if (now - fpsClock >= 500) {
        setFps(Math.round((frames * 1000) / (now - fpsClock)));
        frames = 0;
        fpsClock = now;
      }
    };

    // Resizing the canvas clears it, so the static case has to repaint after.
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) paint(performance.now());
    });
    ro.observe(box);

    if (reduced) {
      // show one completed trace rather than a frozen half-finished one
      startedAt = performance.now() - current.total * SPEED;
      paint(performance.now());
      setDone(LAYERS.length - 1);
      setFps(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  const shownTotal = shot.spans.slice(0, done + 1).reduce((a, b) => a + b, 0);

  return (
    <div className="border border-rule bg-panel">
      <div className="flex items-center justify-between border-b border-rule px-3 py-2">
        <span className="font-mono text-[11px] text-dim">request trace</span>
        <span className="tnum flex items-center gap-2 font-mono text-[11px] text-dim2">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-signal"
            style={{ animation: "pulse 1.6s ease-in-out infinite" }}
          />
          <span className="inline-block w-[48px] text-right">
            {fps > 0 ? `${fps} fps` : "paused"}
          </span>
        </span>
      </div>

      <div className="flex h-[184px] px-3 py-1">
        <div className="flex w-[76px] shrink-0 flex-col justify-around sm:w-[104px]">
          {LAYERS.map((l, i) => (
            <div key={l.key} className="flex items-baseline gap-2 leading-none">
              <span
                className={`font-mono text-[11px] transition-colors duration-150 ${
                  i <= done ? "text-text" : "text-dim2"
                }`}
              >
                {l.key}
              </span>
            </div>
          ))}
        </div>

        <div ref={boxRef} className="relative h-full min-w-0 flex-1">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="A synthetic request traced through browser, edge, API, cache and database layers, drawn live on canvas. Decorative."
          />
        </div>

        <div className="flex w-[58px] shrink-0 flex-col justify-around pl-2 sm:w-[104px] sm:pl-3">
          {LAYERS.map((l, i) => {
            const skipped = shot.spans[i] === 0 && i <= done;
            return (
              <div
                key={l.key}
                className="tnum flex items-baseline justify-end gap-2 leading-none"
              >
                <span className="hidden font-mono text-[10px] text-dim2 sm:inline">
                  {l.tech}
                </span>
                {/* One element with one reserved width. A nested span would be
                    re-positioned inside it every time the value changes, which
                    reads as a layout shift on every tick. */}
                <span
                  className={`w-[46px] text-right font-mono text-[11px] ${
                    skipped || i > done ? "text-dim2" : "text-text"
                  }`}
                >
                  {skipped
                    ? "skip"
                    : i <= done
                      ? shot.spans[i].toFixed(1)
                      : "·"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="tnum flex items-center justify-between border-t border-rule px-3 py-2 font-mono text-[11px]">
        <span className="text-dim2">round trip</span>
        <span className="w-[72px] text-right text-text">
          {shownTotal.toFixed(1)} ms
        </span>
        <span
          className={`w-[70px] text-right ${
            shot.cacheHit ? "text-signal" : "text-dim2"
          }`}
        >
          {shot.cacheHit ? "cache hit" : "cache miss"}
        </span>
      </div>
    </div>
  );
}
