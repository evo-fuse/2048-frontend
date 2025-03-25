import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MenuButton } from "../../../components";
import { PATH } from "../../../const";
import { Images } from "../../../assets/images";

// List of contributors
const CONTRIBUTORS = [
  { role: "Product Manager", name: "Brad Smith" },
  { role: "UI/UX Designer", name: "Thanh Vu" },
  { role: "Backend Engineer", name: "Michael Chen" },
  { role: "Frontend Developer", name: "Sarah Williams" },
  { role: "QA Engineer", name: "David Rodriguez" },
  { role: "DevOps Engineer", name: "Emily Taylor" },
  { role: "Art Director", name: "James Wilson" },
  { role: "Sound Designer", name: "Olivia Martinez" },
  { role: "Game Designer", name: "Daniel Thompson" },
  { role: "3D Artist", name: "Sophia Lee" },
  { role: "Animator", name: "Ethan Brown" },
  { role: "Writer", name: "Ava Garcia" },
  { role: "Marketing", name: "Noah Anderson" },
  { role: "Community Manager", name: "Isabella Moore" },
  { role: "Producer", name: "William Jackson" },
  { role: "Creative Director", name: "Elena Rodriguez" },
];

// CSS for 3D golden metallic text
const goldMetallicStyle = {
  textShadow: `
    0 0.5px 5px #CB8636,
    0 5px 10px rgba(0, 0, 0, 0.6)
  `,
  background: 'linear-gradient(to bottom, #f0c419 0%, #f7dc6f 50%, #f0c419 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  filter: 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.5))',
  fontWeight: 'bold',
  letterSpacing: '2px',
};

export const CreditsView: React.FC = () => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  // Animation effect for scrolling credits
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => prev + 1);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Reset position when credits reach a certain point
  useEffect(() => {
    if (scrollPosition > 3000) {
      setScrollPosition(0);
    }
  }, [scrollPosition]);

  return (
    <div className="flex flex-col items-center justify-between h-screen py-4 relative overflow-hidden">
      {/* Fixed logo at the top */}
      <div className="fixed top-4 z-10">
        <img src={Images.Logo} width={600} alt="Game Logo" />
      </div>

      {/* Scrolling credits container */}
      <div className="h-full w-full flex justify-center overflow-hidden mt-56 mb-24">
        <div 
          className="flex flex-col items-center"
          style={{ 
            transform: `translateY(${-scrollPosition}px)`,
          }}
        >
          {/* Duplicate the contributors list to create an infinite scroll effect */}
          {[...CONTRIBUTORS, ...CONTRIBUTORS, ...CONTRIBUTORS].map((contributor, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-center my-8"
            >
              <h1
                className="text-3xl mb-2"
                style={{ 
                  fontFamily: "Cinzel Decorative",
                  ...goldMetallicStyle,
                  fontSize: '2.5rem'
                }}
              >
                {contributor.role}
              </h1>
              <p 
                className="text-xl" 
                style={{ 
                  fontFamily: "Cinzel Decorative",
                  ...goldMetallicStyle,
                  fontSize: '1.8rem'
                }}
              >
                {contributor.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed back button at the bottom */}
      <div className="fixed bottom-4 z-10">
        <MenuButton
          onClick={() => {
            navigate(PATH.HOME);
          }}
          width={216}
          height={80}
          text="back-sm"
          delay={0.7}
        />
      </div>
    </div>
  );
};
