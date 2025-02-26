import * as React from "react";
import { SVGProps } from "react";

const AnimatedSvgLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 245 85"
    style={{scale: 1.03}}
    fill="var(--color-background)"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <style>
      {`
        @keyframes fadeInLeft {
          0%   { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes revealRect {
          0% { stroke-dashoffset: 640; }
          100% { stroke-dashoffset: 0; }
        }
        
        .letter {
          opacity: 0;
          transform: translateX(-30px);
          animation: fadeInLeft 0.5s ease-out forwards;
        }
        .letter:nth-child(1) { animation-delay: 0s; }
        .letter:nth-child(2) { animation-delay: 0.2s; }
        .letter:nth-child(3) { animation-delay: 0.4s; }
        .letter:nth-child(4) { animation-delay: 0.6s; }
        .letter:nth-child(5) { animation-delay: 0.8s; }

        .rect {
          stroke-dasharray: 640;
          stroke-dashoffset: 640;
          animation: revealRect 1.2s ease-out forwards;
        }
      `}
    </style>
    <rect
      className="rect"
      x="3"
      y="3"
      width="240"
      height="80"
      stroke="var(--color-button-border)"
      strokeWidth="3"
      fill="var(--color-background)"
    />
    <g
      id="textGroup"
      fill="black"
      fontSize="48px"
      fontFamily="Arial, sans-serif"
      textAnchor="start"
      dominantBaseline="middle"
    >
      <text className="letter" x="40" y="50" fill="white">V</text>
      <text className="letter" x="80" y="50" fill="white">I</text>
      <text className="letter" x="100" y="50" fill="white">V</text>
      <text className="letter" x="140" y="50" fill="white">E</text>
      <text className="letter" x="180" y="50" fill="white">K</text>
    </g>
  </svg>
);

export default AnimatedSvgLogo;
