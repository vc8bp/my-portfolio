import React from 'react';
import Image from 'next/image';
import style from "./Work.module.css"

const projects = [
  {
    title: "Halcyon Theme",
    description: "A minimal, dark blue theme for VS Code, Sublime Text, Atom, iTerm, and more. Available on Visual Studio Marketplace, Package Control, Atom Package Manager, and npm.",
    image: "/placeholder-image.png",
    tags: ["VS Code", "Sublime Text", "Atom", "iTerm2", "Hyper"],
    link: "#"
  },
  {
    title: "Spotify Profile",
    description: "A web app for visualizing personalized Spotify data. View your top artists, top tracks, recently played tracks, and detailed audio information about each track.",
    image: "/placeholder-image.png",
    tags: ["React", "Spotify API", "Next.js"],
    link: "#"
  }
];

const Work = () => {
  return (
    <section className="bg-background text-foreground py-20 px-10 md:px-20 container max-w-[1200px] mx-auto pt-28" id="work">
      <p className='hover:text-primary transition-color duration-300 text-3xl font-semibold'>
            <span className='text-primary mr-1 font-mono ' >03. </span>
            Some Things I've Built
        </p>
      <div className={`mt-6 space-y-16`}>
        {projects.map((project, index) => (
          <div key={index} className={`flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 gap-8 relative my-auto ${style.cards}`}>
            <div className={`md:w-[60%] relative ${style.imgWrapper}`}>
              <Image 
                src={project.image} 
                alt={project.title} 
                width={800} 
                height={350} 
                className="rounded-lg"
              />
            </div>
            <div className={`${style.cardInfo} absolute left-0`}  >
              <p className="text-primary text-sm font-semibold ">Featured Project</p>
              <h3 className="text-xl font-semibold text-secondary mt-1">{project.title}</h3>
              <p className="text-muted mt-2 text-sm md:text-base bg-navy text-muted p-4 rounded-xl" style={{boxShadow: "rgba(2, 12, 27, 0.7)"}}>{project.description}</p>
              <div className="flex flex-wrap gap-7 mt-4 flex-wrap">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="py-1 rounded text-s font-mono" style={{color: "var(--light-slate)"}}>{tag}</span>
                ))}
              </div>
              <a href={project.link} className="text-primary mt-4 inline-block">View Project ↗</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Work;
