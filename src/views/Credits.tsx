import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo (3).jpeg";
import { MenuButton } from "../components";
import { PATH } from "../const";

export const CreditsView: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-between h-screen py-4">
      <img src={Logo} width={600} />
      <div className="flex flex-col items-center justify-center text-yellow-400">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "Cinzel Decorative" }}
        >
          Product Manager
        </h1>
        <p className="text-xl" style={{ fontFamily: "Cinzel Decorative" }}>
          Joseph Roque
        </p>
      </div>
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
  );
};
