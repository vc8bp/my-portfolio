import React from "react";
import { LuArrowUpRight, LuGithub } from "react-icons/lu";
import archiveProjects from "@/public/project.json";

type Row = (typeof archiveProjects)[number];

function Links({ link, title }: { link: Row["link"]; title: string }) {
  return (
    <div className="flex items-center gap-4">
      {link.live && (
        <a
          href={link.live}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${title} live site`}
          className="-m-2.5 p-2.5 text-dim transition-colors hover:text-signal"
        >
          <LuArrowUpRight className="h-4 w-4" />
        </a>
      )}
      {link.github && (
        <a
          href={link.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${title} source on GitHub`}
          className="-m-2.5 p-2.5 text-dim transition-colors hover:text-signal"
        >
          <LuGithub className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

export default function ArchiveTable({ limit }: { limit?: number }) {
  const rows = limit ? archiveProjects.slice(0, limit) : archiveProjects;

  return (
    <div className="group mt-2">
      {/* column labels — desktop only; each row is self-describing to a screen reader */}
      <div
        aria-hidden
        className="hidden grid-cols-12 gap-6 border-b border-rule py-3 pl-5 font-mono text-[11px] text-dim2 md:grid"
      >
        <span className="col-span-1">Year</span>
        <span className="col-span-4">Project</span>
        <span className="col-span-3">Made at</span>
        <span className="col-span-3">Built with</span>
        <span className="col-span-1 text-right">Links</span>
      </div>

      <ul>
        {rows.map((project, i) => {
          const primary = project.link.live || project.link.github;
          return (
            <li
              key={project.title}
              data-reveal="fade"
              data-row
              style={{ ["--i" as string]: i }}
              className="py-5 pl-5 transition-all duration-200 group-hover:opacity-40 group-focus-within:opacity-40 hover:!opacity-100 hover:bg-panel focus-within:!opacity-100 md:grid md:grid-cols-12 md:gap-6 md:py-4"
            >
              <span className="tnum block font-mono text-xs text-dim md:col-span-1">
                {project.year}
              </span>

              <div className="mt-1 md:col-span-4 md:mt-0">
                {primary ? (
                  <a
                    href={primary}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline decoration-rule underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
                  >
                    {project.title}
                  </a>
                ) : (
                  <span className="font-medium">{project.title}</span>
                )}
                <p className="mt-1.5 max-w-measure text-sm leading-relaxed text-dim md:hidden">
                  {project.description}
                </p>
              </div>

              <span className="mt-2 block font-mono text-xs text-dim md:col-span-3 md:mt-0">
                {project.madeAt}
              </span>

              <span className="mt-2 block font-mono text-xs leading-relaxed text-dim2 md:col-span-3 md:mt-0">
                {project.tags.join("  ")}
              </span>

              <div className="mt-3 md:col-span-1 md:mt-0 md:flex md:justify-end">
                <Links link={project.link} title={project.title} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
