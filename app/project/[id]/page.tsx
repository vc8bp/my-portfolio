import { notFound } from "next/navigation";
import Link from "next/link";
import { LuArrowLeft, LuGithub, LuArrowUpRight } from "react-icons/lu";
import Images from "./Images";
import Readout from "@/app/(components)/Readout";
import projects from "@/public/projectData.json";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectData = projects.find((e) => e.slug === id);

  if (!projectData) {
    return {
      title: "Project not found",
      description: "The requested project could not be found.",
    };
  }

  return {
    title: `${projectData.title} | Vivek Chaturvedi`,
    description: projectData.description,
    keywords: [...projectData.technologies, "Software Development", projectData.title],
    alternates: { canonical: `/project/${projectData.slug}` },
    openGraph: {
      title: `${projectData.title} | Vivek Chaturvedi`,
      description: projectData.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${projectData.title} | Vivek Chaturvedi`,
      description: projectData.description,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((e) => e.slug === id);
  if (!project) return notFound();

  const githubUrl = "githubUrl" in project ? project.githubUrl : undefined;
  const liveUrl = "liveUrl" in project ? project.liveUrl : undefined;
  const isProprietary = "companyProject" in project && project.companyProject;
  const metrics = "metrics" in project ? project.metrics : undefined;
  const metricsAsOf = "metricsAsOf" in project ? project.metricsAsOf : undefined;

  return (
    <main className="pt-[4.5rem]">
      <div className="mx-auto w-full max-w-[1240px] px-[var(--gutter)] py-16 md:py-20">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 font-mono text-xs text-dim transition-colors hover:text-signal"
        >
          <LuArrowLeft className="h-3.5 w-3.5" />
          Back to work
        </Link>

        <div className="mt-10 grid gap-12 border-b border-rule pb-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <h1 className="text-[clamp(2.2rem,6vw,4rem)] font-semibold leading-[1] tracking-tightest">
              {project.title}
            </h1>
            <p className="mt-6 max-w-measure leading-relaxed text-dim">
              {project.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-signal bg-signal px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-transparent hover:text-signal"
                >
                  <LuArrowUpRight className="h-4 w-4" />
                  Open live site
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-rule px-4 py-2 text-sm text-dim transition-colors hover:border-text hover:text-text"
                >
                  <LuGithub className="h-4 w-4" />
                  View source
                </a>
              )}
            </div>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <dl>
              {project.images.length > 0 && (
                <Readout label="screens" value={project.images.length} />
              )}
              <Readout
                label="source"
                value={githubUrl ? "public" : "not public"}
              />
              {isProprietary && <Readout label="access" value="restricted" />}
            </dl>

            {metrics && metrics.length > 0 && (
              <dl className="mt-8 border border-rule bg-panel">
                <div className="flex items-baseline justify-between border-b border-rule px-4 py-2.5">
                  <span className="font-mono text-[11px] text-dim">measured</span>
                  {metricsAsOf && (
                    <span className="font-mono text-[11px] text-dim2">
                      {metricsAsOf}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2">
                  {metrics.map((m, i) => (
                    <div
                      key={m.label}
                      className={`px-4 py-3 ${
                        i % 2 === 0 ? "border-r border-rule" : ""
                      } ${i < metrics.length - 2 ? "border-b border-rule" : ""}`}
                    >
                      <dd className="tnum font-mono text-lg text-text">
                        {m.value}
                      </dd>
                      <dt className="mt-1 font-mono text-[11px] leading-snug text-dim2">
                        {m.label}
                      </dt>
                    </div>
                  ))}
                </div>
              </dl>
            )}
          </div>
        </div>

        {isProprietary && (
          <p className="mt-8 border-l border-signal py-1 pl-4 font-mono text-xs text-dim">
            {project.companyNote}
          </p>
        )}

        {(project.images.length > 0 ||
          ("videoUrl" in project && project.videoUrl)) && (
          <section className="mt-12">
            <h2 className="sr-only">Screens</h2>
            <Images
              images={project.images}
              videoUrl={"videoUrl" in project ? project.videoUrl : undefined}
            />
          </section>
        )}

        <section className="mt-16 border-t border-rule pt-10">
          <h2 className="border-b border-rule pb-4 text-xl font-medium tracking-tightest">
            Built with
          </h2>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {project.technologies.map((tech) => (
              <li key={tech} className="font-mono text-sm text-dim">
                {tech}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
          {project.content.map((section) => (
            <section key={section.title} className="border-t border-rule pt-10">
              <h2 className="text-xl font-medium tracking-tightest">
                {section.title}
              </h2>
              <ul className="mt-6 space-y-3 border-l border-rule pl-4">
                {section.descriptions.map((desc) => (
                  <li
                    key={desc}
                    className="text-sm leading-relaxed text-dim"
                  >
                    {desc}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
