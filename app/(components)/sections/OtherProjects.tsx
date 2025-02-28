import React from 'react';
import Image from 'next/image';
import { FaGithub, FaInstagram, FaTwitter, FaLinkedin, FaCodepen, FaExternalLinkAlt, FaFolder } from 'react-icons/fa';
import Link from 'next/link';

const projects = [
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

const OtherProjects = () => {
  return (
    <section className=" text-foreground py-20 px-10 md:px-20 text-center container mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-muted">Other Noteworthy Projects</h2>
      <Link href="/archive" className="text-primary text-sm md:text-base block mt-2">view the archive</Link>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, index) => (
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
