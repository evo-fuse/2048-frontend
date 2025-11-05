import { useEffect, useState } from "react";

interface Sparkle {
    id: number;
    axis: "horizontal" | "vertical" | "depth";
    position: number; // 0-1 representing position along the axis
    speed: number;
    size: number;
    opacity: number;
}

export const GridSparkles = () => {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);

    useEffect(() => {
        // Initialize sparkles
        const initialSparkles: Sparkle[] = [];
        const sparkleCount = 1; // Total sparkles across all axes

        // Create sparkles for each axis
        for (let i = 0; i < sparkleCount; i++) {
            const axisType = i % 3 === 0 ? "horizontal" : i % 3 === 1 ? "vertical" : "depth";
            initialSparkles.push({
                id: i,
                axis: axisType,
                position: Math.random(),
                speed: 0.0001, // Fast movement speed
                size: 10 + Math.random() * 4,
                opacity: 0.6 + Math.random() * 0.4,
            });
        }

        setSparkles(initialSparkles);

        // Animation loop
        const animationFrame = requestAnimationFrame(function animate() {
            setSparkles((prev) =>
                prev.map((sparkle) => {
                    let newPosition = sparkle.position + sparkle.speed;
                    // Reset position when it goes off screen
                    if (newPosition > 1.2) {
                        newPosition = -0.2;
                        // Keep the same speed (velocity) but randomize other properties
                        return {
                            ...sparkle,
                            position: newPosition,
                            // Keep the same speed to maintain consistent velocity
                            opacity: 0.6 + Math.random() * 0.4,
                        };
                    }
                    return {
                        ...sparkle,
                        position: newPosition,
                    };
                })
            );
            requestAnimationFrame(animate);
        });

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    const getSparkleStyle = (sparkle: Sparkle) => {
        const baseStyle: React.CSSProperties = {
            position: "fixed",
            pointerEvents: "none",
            zIndex: 1,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            opacity: sparkle.opacity,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(165, 243, 252, 1) 0%, rgba(6, 182, 212, 0.8) 50%, transparent 100%)",
            boxShadow: "0 0 8px rgba(6, 182, 212, 0.9), 0 0 16px rgba(34, 211, 238, 0.6), 0 0 24px rgba(6, 182, 212, 0.4)",
        };

        switch (sparkle.axis) {
            case "horizontal":
                // Horizontal axis - travel left to right across the screen
                return {
                    ...baseStyle,
                    left: `${sparkle.position * 100}%`,
                    top: `${30 + Math.sin(sparkle.id * 2.5) * 20}%`, // Some vertical variation
                    transform: "translate(-50%, -50%)",
                };

            case "vertical":
                // Vertical axis - travel top to bottom
                return {
                    ...baseStyle,
                    top: `${sparkle.position * 100}%`,
                    left: `${30 + Math.cos(sparkle.id * 2.5) * 20}%`, // Some horizontal variation
                    transform: "translate(-50%, -50%)",
                };

            case "depth":
                // Depth axis - travel along perspective lines toward/away from vanishing point
                // Use multiple paths radiating from the vanishing point
                const centerX = 50; // Vanishing point X
                const centerY = 40; // Vanishing point Y
                const pathIndex = sparkle.id % 8; // 8 different depth paths for variety
                const baseAngle = (pathIndex * Math.PI * 2) / 8; // 8 directions
                const angle = baseAngle + (Math.sin(sparkle.id * 0.5) * 0.3); // Add some variation

                // Position along the depth line (0 = near, 1 = far)
                const depthFactor = sparkle.position;
                const maxDistance = 70; // Maximum distance from center

                // Calculate position along the perspective line
                const x = centerX + Math.cos(angle) * depthFactor * maxDistance;
                const y = centerY + Math.sin(angle) * depthFactor * maxDistance;

                return {
                    ...baseStyle,
                    left: `${x}%`,
                    top: `${y}%`,
                    // Scale down as it goes deeper (perspective effect)
                    transform: `translate(-50%, -50%) scale(${Math.max(0.3, 1 - depthFactor * 0.7)})`,
                };

            default:
                return baseStyle;
        }
    };

    return (
        <>
            {sparkles.map((sparkle) => (
                <div key={sparkle.id} style={getSparkleStyle(sparkle)} />
            ))}
        </>
    );
};

