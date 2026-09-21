import React from "react";
import Panel from "../Panel";

const EMAIL = "vc8bp3@gmail.com";

export default function Contact() {
  return (
    <Panel id="contact" title="Get in touch">
      <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-16">
        <p className="max-w-measure leading-relaxed text-dim md:col-span-6">
          My inbox is open. A role, a system you&rsquo;re stuck on, or a
          question about something here. I read everything and I&rsquo;ll get back
          to you.
        </p>

        <div className="md:col-span-6">
          <a
            href={`mailto:${EMAIL}`}
            className="block text-[clamp(1.5rem,4vw,2.75rem)] font-medium tracking-tightest underline decoration-rule decoration-1 underline-offset-[0.2em] transition-colors hover:text-signal hover:decoration-signal"
          >
            {EMAIL}
          </a>
          <div className="mt-8 flex gap-8">
            <a
              href="https://github.com/vc8bp/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-dim transition-colors hover:text-signal"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/vivek-chaturvedi903/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-dim transition-colors hover:text-signal"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </Panel>
  );
}
