import React from 'react'
import CharectorSvg from '../CharectorSvg';

const About = () => {
    return (
        <section className="bg-background text-foreground  px-10 md:px-20  container m-auto max-w-[1000px] h-screen flex items-center " id='about'>
            <div className='flex flex-col md:flex-row items-center md:items-start w-full' >
                <div className="md:w-2/3">
                    <p className='hover:text-primary transition-color duration-300 text-3xl font-semibold'>
                        <span className='text-primary mr-1 font-mono ' >01. </span>
                        About Me
                    </p>
                    <p className="text-muted mt-4 text-sm md:text-base max-w-2xl">
                        Hello! My name is Vivek and I enjoy creating efficient, high-performance web applications. My expertise spans across front-end and back-end development, cloud deployments, and system optimization.
                        I have experience working with various organizations, from startups to enterprises, delivering scalable and innovative solutions.
                    </p>
                    <p className="text-muted mt-4 text-sm md:text-base max-w-2xl">
                        Currently, I am focused on advancing my skills in C++ for high-frequency trading systems, while leveraging my knowledge in React, Python, and DevOps to build impactful applications.
                    </p>
                    <p className="text-primary font-semibold mt-6">Technologies I work with:</p>
                    <ul className="grid grid-cols-2 gap-2 mt-2 text-muted text-sm md:text-base">
                        <li>&#9656; JavaScript (ES6+)</li>
                        <li>&#9656; TypeScript</li>
                        <li>&#9656; React</li>
                        <li>&#9656; Node.js</li>
                        <li>&#9656; Python</li>
                        <li>&#9656; C++</li>
                    </ul>
                </div>
                <div className="md:w-1/3 mt-10 md:mt-0 flex justify-center md:justify-end items-end ">
                    <CharectorSvg />
                </div>
            </div>

        </section>
    );
};

export default About