interface GameLayoutProps {
  children: React.ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
      <div className="relative z-10 w-full h-full flex flex-col justify-start items-center mt-0 bg-gray-950">
        {children}
      </div>
    </div>
  );
};

export const withGameLayout = (Page: React.FC) => {
  return () => (
    <GameLayout>
      <Page />
    </GameLayout>
  );
};
