import Hero from "./(components)/sections/Hero";
import About from "./(components)/sections/About";
import Experience from "./(components)/sections/Experience";
import Work from "./(components)/sections/Work/Work";
import Contect from "./(components)/sections/Contect";
import OtherProjects from "./(components)/sections/OtherProjects";

export default function Home() {
  return (
    <>
      <Hero/>
      <About/>
      <Experience/>
      <Work/>
      <OtherProjects/>
      <Contect/>
    </>
  );
}
