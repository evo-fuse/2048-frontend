import { useState, useEffect } from "react";
import Cursor from "../assets/images/cursor1.jpg";

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Add cursor: none to the body element when component mounts
    document.body.style.cursor = "none";

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updatePosition);

    return () => {
      // Reset cursor style when component unmounts
      document.body.style.cursor = "default";
      window.removeEventListener("mousemove", updatePosition);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        transform: "translate(0%, 0%)", // Center the cursor
        pointerEvents: "none", // Prevent the cursor from interfering with clicks
        zIndex: 99999,
      }}
    >
      <img
        src={Cursor}
        alt="cursor"
        className={`min-w-16 min-h-16 max-w-16 max-h-16`}
      />
    </div>
  );
};
