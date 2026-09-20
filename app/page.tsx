import Hero from "./(components)/sections/Hero";
import About from "./(components)/sections/About";
import Experience from "./(components)/sections/Experience";
import Work from "./(components)/sections/Work";
import OtherProjects from "./(components)/sections/OtherProjects";
import Contact from "./(components)/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Work />
      <OtherProjects />
      <Contact />
    </main>
  );
}
