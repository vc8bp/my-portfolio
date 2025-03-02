import React from 'react';
import Image from 'next/image';
import style from "./Work.module.css"
import projects from "@/public/projectData.json"
import Link from 'next/link';

const projectss = [
  {
    "title": "Production-ready eCommerce",
    "description": "A full-stack eCommerce platform with a Node.js (Express) + MongoDB backend, a React frontend for shoppers, and a React admin dashboard for store management. It supports user authentication, product browsing, shopping cart & checkout, and includes an admin interface for inventory and order management.",
    "image": "/placeholder-image.png",
    "tags": ["Node.js", "Express.js", "MongoDB", "React", "Material-UI", "Redux"],
    "link": {
      "live": "https://satnamcreation.netlify.app",
      "github": "https://github.com/vc8bp/shop-api-backend"
    }
  },
  {
    "title": "HRMS",
    "description": "A Human Resource Management System web application to streamline HR processes like employee data management and leave tracking. It provides an admin interface for HR managers to manage employee records and leave requests, and an employee portal to view information and apply for leaves. Built using the MERN stack for a responsive, single-page experience.",
    "image": "/placeholder-image.png",
    "tags": ["MongoDB", "Express.js", "React", "Node.js"],
    "link": {
      "live": "",
      "github": "https://github.com/vc8bp/hrms"
    }
  },
  {
    "title": "Raycasting in JS",
    "description": "A JavaScript project demonstrating the raycasting algorithm to simulate a 3D perspective in a 2D environment. It casts rays from a player's viewpoint in a 2D grid (like in Wolfenstein 3D) and renders a pseudo-3D scene of walls, showcasing how early 3D games used raycasting for visual effects.",
    "image": "/placeholder-image.png",
    "tags": ["JavaScript", "HTML5 Canvas", "HTML/CSS"],
    "link": {
      "live": "",
      "github": "https://github.com/vc8bp/raycasting"
    }
  },
  {
    "title": "Chess",
    "description": "A web-based chess game built with React. It features an interactive chessboard and allows two players to play against each other with all standard chess rules enforced. The application manages game state, validates moves, and provides a responsive UI for an intuitive online chess experience.",
    "image": "/placeholder-image.png",
    "tags": ["React", "JavaScript", "HTML/CSS"],
    "link": {
      "live": "https://cchess.netlify.app",
      "github": "https://github.com/vc8bp/chess"
    }
  },
  {
    "title": "Algorithmic Trading Project in C++",
    "description": "An algorithmic trading system implemented in C++. It includes modules for processing real-time market data feeds, an Order Management System for executing trades, and strategy modules for automated trading decisions. The project focuses on high-performance trade execution and demonstrates use of data structures and concurrency for low-latency trading.",
    "image": "/placeholder-image.png",
    "tags": ["C++", "Multithreading", "Linux"],
    "link": {
      "live": "",
      "github": "https://github.com/vc8bp/Trading-Project"
    }
  },
  {
    "title": "Multi-Agent eCommerce Project",
    "description": "A MERN stack multi-agent shopping website that enables multiple sellers to upload and manage their products, while normal users can browse products, add items to a cart, and make purchases. The site features an intuitive interface and intelligent agents that assist users in finding the best products.",
    "image": "/placeholder-image.png",
    "tags": ["MongoDB", "Express.js", "React", "Node.js"],
    "link": {
      "live": "",
      "github": "https://github.com/vc8bp/multi-agent-shoping-website"
    }
  },
  {
    "title": "Stancore - Company Landing Page",
    "description": "A modern landing page developed for the company Stancore. It is built with Next.js and styled with SCSS, providing a fast and responsive single-page site to showcase Stancore's business information and services. The landing page highlights the company's offerings and includes contact information.",
    "image": "/placeholder-image.png",
    "tags": ["Next.js", "React", "SCSS"],
    "link": {
      "live": "https://stancore.vercel.app",
      "github": "https://github.com/vc8bp/stancore"
    }
  },
  {
    "title": "Spectra Global",
    "description": "The official website of Spectra Global Ltd., an award-winning forex and CFD trading platform. The site provides information on trading services (Forex, Indices, Stocks, Futures) offered via the MetaTrader 5 platform and allows users to open demo accounts. It highlights Spectra Global's features and services as a leading broker, including its range of trading instruments and secure platform.",
    "image": "/placeholder-image.png",
    "tags": ["WordPress", "PHP", "CSS"],
    "link": {
      "live": "https://spectragloballtd.com",
      "github": ""
    }
  },
  {
    "title": "Ebullient Securities",
    "description": "A corporate website for Ebullient Securities, a leading quantitative proprietary trading firm. The site showcases the company's profile, its focus on options trading and quantitative strategies, and provides contact and career information. It emphasizes Ebullient's status as one of India's premier prop trading firms and offers insight into its trading approach.",
    "image": "/placeholder-image.png",
    "tags": ["WordPress", "PHP", "CSS"],
    "link": {
      "live": "https://ebullientsecurities.com",
      "github": ""
    }
  }
]

const Work = () => {
  return (
    <section className=" text-foreground py-20 px-10 md:px-20 container max-w-[1200px] mx-auto pt-28" id="work">
      <p className='hover:text-primary transition-color duration-300 text-3xl font-semibold'>
            <span className='text-primary mr-1 font-mono ' >03. </span>
            {"Some Things I've Built"}
        </p>
      <div className={`mt-6 space-y-16`}>
        {projects.map((project, index) => (
          <div key={index} className={`flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 gap-8 relative my-auto ${style.cards}`}>
            <div className={`aspect-video h-[400px] relative ${style.imgWrapper}`}>
              <Image
                src={project.images[0].url}
                alt={project.images[0].alt}
                className="rounded-lg"
                fill
              />
            </div>
            <div className={`${style.cardInfo} absolute left-0`}>
              <p className="text-primary text-sm font-semibold">Featured Project</p>
              <h3 className="text-xl font-semibold text-secondary mt-1">{project.title}</h3>
              <p className="text-muted mt-2 text-sm md:text-base bg-navy text-muted p-4 rounded-xl" style={{ boxShadow: "rgba(2, 12, 27, 0.7)" }}>
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4 " >
                {project.technologies.map((tag, idx) => (
                  <span
                    key={idx}
                    className="py-1 px-2 rounded text-sm font-mono bg-navy"
                    style={{ boxShadow: "rgba(2, 12, 27, 0.7)" }}
                  >
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
