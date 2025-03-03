import React from 'react';

const Hero = () => {
  return (
    <section className="text-foreground h-screen flex flex-col justify-center items-start px-10 md:px-20 container mx-auto" id='main'>
      <p className="text-primary text-sm md:text-base">Hi, my name is</p>
      <h1 className="text-4xl md:text-6xl font-bold text-muted mt-2">Vivek chaturvedi.</h1>
      <h2 className="text-4xl md:text-6xl font-bold text-secondary opacity-80 mt-2">
        I build scalable web solutions.
      </h2>
      <p className="text-muted max-w-lg mt-4 text-sm md:text-base">
        {`I'm a React developer with expertise in DevOps, backend development with Python, and leading teams. 
        Currently, I'm exploring C++ for high-frequency trading and enhancing system performance.`}
      </p>
      <a
        href="#work"
        className="border border-buttonBorder text-primary px-6 py-2 rounded-md mt-6 hover:bg-primary hover:text-background transition"
      >
        Check out my projects!
      </a>
    </section>
  );
};

export default Hero;
