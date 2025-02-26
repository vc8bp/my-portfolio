"use client"
import { useEffect, useState } from "react";
import { BsFillCursorFill } from "react-icons/bs";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.body.style.cursor = "none";
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX+10, y: e.clientY+10 });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.body.style.cursor = "default";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        pointerEvents: "none",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(-50%, -50%) scale(1) " : "translate(-50%, -50%) scale(0.5)",
        filter: "drop-shadow(2px 2px 6px rgba(0,0,0,0.2))",
        zIndex: 9999,
      }}
    >
      <BsFillCursorFill style={{transform: "rotate(-90deg)"}} size={24} color="#fff"  />
    </div>
  );
};

export default CustomCursor;
