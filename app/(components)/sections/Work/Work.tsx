import React from 'react';
import Image from 'next/image';
import style from "./Work.module.css";
import projects from "@/public/projectData.json";
import Link from 'next/link';

const Work = () => {
  return (
    <section className="text-foreground py-20 px-10 md:px-20 container max-w-[1200px] mx-auto pt-28" id="work">
      <p className='hover:text-primary transition-color duration-300 text-3xl font-semibold'>
        <span className='text-primary mr-1 font-mono'>03. </span>
        {"Some Things I've Built"}
      </p>
      <div className={`mt-6 space-y-16`}>
        {projects.map((project, index) => (
          <div key={index} className={`flex w-full flex-col md:flex-row items-center  space-y-4 md:space-y-0 gap-8  my-auto ${style.cards} relative min-h-[400px]`}>
            <div className={`h-[400px]  overflow-hidden rounded-lg ${style.imgWrapper} absolute`}>
              {project.images && project.images.length > 0 && (
                <Image
                  src={project.images[0].url || "/placeholder-image.png"}
                  alt={project.images[0].alt || "Project Image"}
                  className="rounded-lg object-cover w-full h-full"
                  width={600}
                  height={350}
                />
              )}
            </div>
            <div className={`${style.cardInfo} w-full max-w-[600px] text-left `}> 
              <p className="text-primary text-sm font-semibold">Featured Project</p>
              <h3 className="text-xl font-semibold text-secondary mt-1">{project.title}</h3>
              <p className="text-muted mt-2 text-sm md:text-base bg-navy p-4 rounded-xl" style={{ boxShadow: "rgba(2, 12, 27, 0.7)" }}>
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.technologies.map((tag, idx) => (
                  <span key={idx} className="py-1 px-2 rounded text-sm font-mono bg-navy" style={{ boxShadow: "rgba(2, 12, 27, 0.7)" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 mt-4">
                <Link href={`/project/${project.slug}`} className="text-primary inline-block">
                  Details ↗
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Work;