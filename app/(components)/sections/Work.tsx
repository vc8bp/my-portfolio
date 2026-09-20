import React from "react";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import Panel from "../Panel";
import LayerSpan from "../LayerSpan";
import projects from "@/public/projectData.json";

export default function Work() {
  return (
    <Panel
      id="work"
      title="Systems I've built"
      readout={`${projects.length} projects`}
      className="bg-[var(--surface-raised)]"
    >
      <div className="group mt-4">
        {projects.map((project, i) => (
          <Link
            key={project.slug}
            href={`/project/${project.slug}`}
            data-reveal="fade"
            data-row
            style={{ ["--i" as string]: i }}
            className="group/row block py-7 pl-5 transition-all duration-200 group-hover:opacity-40 group-focus-within:opacity-40 hover:!opacity-100 hover:bg-panel2 focus-within:!opacity-100"
          >
            <div className="md:grid md:grid-cols-12 md:items-start md:gap-10">
              <div className="md:col-span-6">
                <h3 className="flex items-center gap-3 text-xl font-medium tracking-tightest">
                  {project.title}
                  <LuArrowRight className="h-4 w-4 shrink-0 text-dim2 transition-all duration-200 group-hover/row:translate-x-1 group-hover/row:text-signal" />
                </h3>
                <p className="mt-2 max-w-measure text-sm leading-relaxed text-dim">
                  {project.description}
                </p>
                {"companyProject" in project && project.companyProject && (
                  <p className="mt-3 font-mono text-[11px] text-dim2">
                    proprietary, source not public
                  </p>
                )}
              </div>

              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 md:col-span-4 md:mt-1 md:content-start">
                {project.technologies.map((tech) => (
                  <li key={tech} className="font-mono text-xs text-dim2">
                    {tech}
                  </li>
                ))}
              </ul>

              <div className="mt-6 md:col-span-2 md:mt-0 md:flex md:justify-end">
                <LayerSpan technologies={project.technologies} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Panel>
  );
}
