import React from 'react';
import { FaGithub, FaExternalLinkAlt, FaFolder } from 'react-icons/fa';
import Link from 'next/link';
import projects from "@/public/project.json"


const OtherProjects = () => {
  return (
    <section className=" text-foreground py-20 lg:px-20 md:px-10 px-5 text-center container mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-muted">Other Noteworthy Projects</h2>
      <Link href="/archive" className="text-primary text-sm md:text-base block mt-2">view the archive</Link>
      <div className="mt-10 grid  md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-6">
        {projects.slice(0, 6).map((project, index) => (
          <div key={index} style={{ backgroundColor: "rgba(10, 25, 47, 0.6)" }} className="backdrop-blur-md rounded-lg p-6 text-left relative flex flex-col justify-between h-full border border-foreground/10">
            <div>
              <div className="flex justify-between items-center">
                <FaFolder className="text-primary text-3xl" />
                <div className='flex gap-2 items-center'>
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
              </div>
              <h3 className="text-lg font-semibold text-foreground mt-4">{project.title}</h3>
              <p className="text-muted text-sm mt-2">{project.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 text-xs text-muted">
              {project.tags.map((tag, idx) => (
                <span key={idx} className="py-1 rounded text-s font-mono" style={{ color: "var(--light-slate)" }}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OtherProjects;
