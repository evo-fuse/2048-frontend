import { useState, useEffect } from "react";
import { useAuthContext } from "../context";
export const CustomCursor = () => {
  const { cursor } = useAuthContext();
  const [position, setPosition] = useState(() => {
    // Initialize with current mouse position if available, otherwise default to (0,0)
    return {
      x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
      y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    };
  });

  useEffect(() => {
    // Add cursor: none to the body element when component mounts
    document.body.style.cursor = "none";

    const updatePosition = (e: Event) => {
      if (e instanceof MouseEvent) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    };

    // Add event listeners for both mousemove and scroll
    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      // Reset cursor style when component unmounts
      document.body.style.cursor = "auto"; // Changed from "none" to "auto"
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("scroll", updatePosition);
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
        src={cursor}
        alt="cursor"
        className={`min-w-16 min-h-16 max-w-16 max-h-16`}
      />
    </div>
  );
};
