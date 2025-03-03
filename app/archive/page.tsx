import React from 'react';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import archiveProjects from "@/public/project.json"


const Archive = () => {
  return (
    <section className=" text-foreground mt-36  container mx-auto">
      <h1 className="text-4xl font-bold text-muted">Archive</h1>
      <p className="text-primary text-sm md:text-base mt-2">{`A big list of things I've worked on`}</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="text-muted border-b border-muted hidden md:table-row">
              <th className="p-3">Year</th>
              <th className="p-3">Title</th>
              <th className="p-3 hidden md:table-cell">Made at</th>
              <th className="p-3 hidden md:table-cell">Built with</th>
              <th className="p-3">Link</th>
            </tr>
          </thead>
          <tbody>
            {archiveProjects.map((project, index) => (
              <tr key={index} className=" hover:bg-navy transition">
                <td className="p-3 text-primary font-semibold">{project.year}</td>
                <td className="p-3 text-foreground font-semibold">{project.title}</td>
                <td className="p-3 hidden md:table-cell text-muted font-mono">{project.madeAt}</td>
                <td className="p-3 hidden md:table-cell text-muted font-mono">{project.tags.join(", ")}</td>
                <td className="p-3">
                  <div className="flex gap-3">
                    {project.link.live && (
                      <a href={project.link.live} target="_blank" rel="noopener noreferrer">
                        <FaExternalLinkAlt className="text-muted hover:text-primary transition" />
                      </a>
                    )}
                    {project.link.github && (
                      <a href={project.link.github} target="_blank" rel="noopener noreferrer">
                        <FaGithub className="text-muted hover:text-primary transition" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Archive;