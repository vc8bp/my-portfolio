"use client"
import React, { useEffect, useState } from "react";

function GradientBlob() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed flex items-center justify-center bg-background inset-0 z-[-1] backdrop-blur-[100px]">
      <div
        className="w-96 h-96 bg-gradient-to-r from-cyan-500/15 via-teal-500/15 to-green-400/15 animate-gradient rounded-full blur-3xl opacity-100"
        style={{
          position: "fixed",
          top: position.y - 384 /2,
          left: position.x - 384 /2,
          transition: "transform 0.1s ease",
        }}
      ></div>
    </div>
  );
}

export default GradientBlob;
