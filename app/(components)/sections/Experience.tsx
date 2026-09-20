import React from "react";
import Panel from "../Panel";

const experiences = [
    {
        company: "Finrise",
        role: "Software Engineer",
        date: "2023 - PRESENT",
        responsibilities: [
            "Developed a high-performance RMS (Risk Management System) featuring real-time data and interactive dynamic graphs using React.",
            "Deployed the complete project in a Linux environment using NGINX and Jenkins for continuous integration and delivery.",
            "Collaborated with the backend team to optimize and rewrite their microservices in C++."
        ],
        skills: ["JavaScript", "React", "C++", "Jenkins", "NGINX"]
    },
    {
        company: "T firm",
        role: "Frontend Developer",
        date: "2023 - 2023",
        responsibilities: [
            "Implemented a dynamic form builder for customizable inputs.",
            "Built real-time graphs and charts with WebSocket integration.",
            "Developed advanced tables with sorting, filtering, grouping, and dataset handling.",
            "Created an interactive dashboard with resizable and rearrangeable components.",
            "Set up CI/CD pipelines using Jenkins for automated deployments.",
            "Deployed the application on a VPS with Nginx, SSL, and reverse proxy configuration."
        ],
        skills: ["React", "WebSockets", "Node.js", "CI/CD", "Nginx"]
    },
    {
        company: "Freelance Web Development",
        role: "Web Developer",
        date: "2021 - 2023",
        responsibilities: [
            "Created modern UIs and dynamic content management systems for Ebulient Securities.",
            "Implemented real-time features and live data streams, ensuring seamless updates.",
            "Deployed applications on AWS using Nginx and Docker for scalability.",
            "Built CI/CD pipelines to streamline and automate deployments.",
            "Designed high-performance React interfaces with dynamic and interactive features.",
            "Developed secure REST APIs using Django for efficient data communication and authentication.",
            "Successfully deployed scalable applications with AWS and Docker integration."
        ],
        skills: ["AWS", "Docker", "Django", "React", "CI/CD", "nodeJs"]
    }
];

export default function Experience() {
  return (
    <Panel
      id="experience"
      title="Where I've worked"
      readout={`${experiences.length} roles   2021 - now`}
    >
      <div className="group mt-4">
        {experiences.map((exp, i) => (
          <article
            key={exp.company}
            data-reveal="fade"
            data-row
            style={{ ["--i" as string]: i }}
            className="py-8 pl-5 transition-all duration-200 group-hover:opacity-40 group-focus-within:opacity-40 hover:!opacity-100 hover:bg-panel focus-within:!opacity-100 md:grid md:grid-cols-12 md:gap-16"
          >
            <p className="tnum flex items-center gap-2 font-mono text-xs text-dim md:col-span-3">
              {exp.date.includes("PRESENT") && (
                <span
                  aria-label="current role"
                  className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-signal"
                />
              )}
              {exp.date}
            </p>

            <div className="mt-3 md:col-span-9 md:mt-0">
              <h3 className="text-lg font-medium tracking-tightest">
                {exp.role}
                <span className="text-dim2">, </span>
                {exp.company}
              </h3>

              <ul className="mt-4 space-y-2.5 border-l border-rule pl-4">
                {exp.responsibilities.map((task) => (
                  <li
                    key={task}
                    className="max-w-measure text-sm leading-relaxed text-dim"
                  >
                    {task}
                  </li>
                ))}
              </ul>

              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5">
                {exp.skills.map((skill) => (
                  <li key={skill} className="font-mono text-xs text-dim2">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
