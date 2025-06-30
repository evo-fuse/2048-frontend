interface GameLayoutProps {
  children: React.ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
      {/* <img
        src={Images.Bg}
        className="fixed top-0 left-0 w-screen h-full object-cover"
        alt="Fantasy Background"
      /> */}
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
