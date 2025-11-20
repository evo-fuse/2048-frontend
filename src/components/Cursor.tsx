import { Images } from "../assets/images";
import { useAuthContext } from "../context";
import { useState, useEffect } from "react";
import { GiArrowCursor } from "react-icons/gi";

export const CustomCursor = () => {
  const { cursor } = useAuthContext();
  const [position, setPosition] = useState(() => {
    // Initialize with current mouse position if available, otherwise default to (0,0)
    return {
      x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
      y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    };
  });
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Add cursor: none to the body element when component mounts
    document.body.style.cursor = "none";

    const updatePosition = (e: Event) => {
      if (e instanceof MouseEvent) {
        setPosition({ x: e.clientX - 8, y: e.clientY });
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Add event listeners for both mousemove and scroll
    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      // Reset cursor style when component unmounts
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        transform: "translate(0, 0)",
        pointerEvents: "none",
        zIndex: 99999,
      }}
      className={`transition-transform duration-100 ease-out ${isClicking ? "scale-90" : "scale-100"
        }`}
    >
      {/* Glow effect behind arrow */}
      <div
        className="absolute -left-1 -top-1 w-8 h-8 blur-md"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.4) 0%, rgba(8, 145, 178, 0.2) 40%, transparent 70%)",
        }}
      />

      {/* Arrow cursor using GiArrowCursor icon */}
      {cursor === Images.HAMMER || cursor === Images.UPGRADE
        ? (<img
          src={cursor}
          alt="cursor"
          className="min-w-12 min-h-16 max-w-12 max-h-min-h-16"
        />
        ) : (<GiArrowCursor
          className="relative text-cyan-500"
          style={{
            fontSize: "28px",
            filter: "drop-shadow(0 0 1px rgba(255, 255, 255, 1)) drop-shadow(0 0 8px rgba(6, 182, 212, 0.3))",
            color: "rgba(6, 182, 212, 0.9)",
          }}
          size={40}
        />)}
    </div>
  );
};
