import Image from "next/image";
import AnimatedSvgLogo from "./(components)/AnimatedSvgLogo";
import Hero from "./(components)/sections/Hero";
import About from "./(components)/sections/About";
import Experience from "./(components)/sections/Experience";
import Work from "./(components)/sections/Work/Work";
import Contect from "./(components)/sections/Contect";
import Footer from "./(components)/Footer";
import CustomCursor from "./(components)/Cursor";
import OtherProjects from "./(components)/sections/OtherProjects";
import GradientBlob from "./GradiantBlob";

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

//ref
// https://brittanychiang.com/
// https://v4.brittanychiang.com/#jobs
