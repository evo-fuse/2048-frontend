import { Images } from "../../../assets/images";
import { Navbar } from "../components";

interface BaseGameLayoutProps {
  children: React.ReactNode;
}

export const BaseGameLayout: React.FC<BaseGameLayoutProps> = ({ children }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
      <img
        src={Images.Bg}
        className="fixed top-0 left-0 w-screen h-full object-cover"
        alt="Fantasy Background"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/50" />
      <div className="relative z-10 w-full h-full flex justify-start items-center mt-0">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export const withBaseGameLayout = (Component: React.FC) => {
  return () => (
    <BaseGameLayout>
      <Component />
    </BaseGameLayout>
  );
};
