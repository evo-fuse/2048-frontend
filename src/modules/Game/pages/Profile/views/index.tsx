import { useAuthContext } from "../../../../../context";
import { motion } from "framer-motion";
import { useWeb3Context } from "../../../../../context/Web3Context";
import { useEffect } from "react";
import { MdOutlineStyle } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { IoWalletOutline } from "react-icons/io5";
import { useGameContext } from "../../../context";

export const ProfileView: React.FC = () => {
  const { user } = useAuthContext();
  const { createdThemes, getCreatedThemes } = useGameContext();
  const { userBalance, getBalance } = useWeb3Context();

  useEffect(() => {
    getBalance();
    getCreatedThemes();
  }, []);

  return (
    <div className="flex flex-col w-full h-full items-start justify-center text-white py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl p-8 relative"
      >
        <div className="text-4xl font-bold text-center mb-6 text-white relative z-10">
          Profile
        </div>

        <div className="space-y-6 w-full relative z-10">
          <div className="border-t border-gray-200 my-4"></div>
          <div className="w-full flex gap-6 h-full">
            <div className="w-full h-min grid grid-cols-1 gap-6">
              <ProfileItem
                label="Grid Size"
                value={`${user?.rows}x${user?.cols}`}
              />
              <ProfileItem label="Max Score" value={user?.maxScore} />
              <ProfileItem label="Max Tile" value={user?.maxTile} />
            </div>
            <div className="min-h-max border-l border-gray-200"></div>
            <div className="w-full grid grid-cols-1 gap-6">
              <ProfileItem label="Hammers" value={user?.hammer} icon="🔨" />
              <ProfileItem label="Power-ups" value={user?.powerup} icon="⚡" />
              <ProfileItem label="Upgrades" value={user?.upgrade} icon="⬆️" />
            </div>
            <div className="min-h-max border-l border-gray-200"></div>
            <div className="w-full h-min grid grid-cols-1 gap-6">
              <ProfileItem
                label="Wallet Address"
                value={
                  user?.address.slice(0, 8) + "..." + user?.address.slice(-6)
                }
                icon={<IoWalletOutline />}
                className="break-all"
              />
              <ProfileItem
                label="Wallet Balance"
                value={userBalance ? `${userBalance} DWAT` : "0 DWAT"}
                icon={<GiMoneyStack />}
              />
              <ProfileItem
                label="Total Themes"
                value={user?.countThemes || 0}
                icon={<MdOutlineStyle />}
              />
            </div>
          </div>
          <div className="border-t border-gray-200 my-4 text-2xl font-bold" />
          <div className="text-2xl font-bold">Latest Created Themes</div>
          <div className="w-full flex flex-wrap gap-4">
            {createdThemes.map((theme) => (
              <div key={theme.uuid} className="flex shadow-md shadow-black rounded-md">
                <img src={theme[2].sm} alt={theme.title} className="w-32" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface ProfileItemProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  fontSize?: string;
}

const ProfileItem: React.FC<ProfileItemProps> = ({
  label,
  value,
  icon,
  className,
  fontSize = "text-xl",
}) => (
  <div className="bg-gray-800/60 rounded-lg p-4 shadow-md border border-white/10 hover:border-white/20 transition-all">
    <div className="text-gray-200 text-sm mb-1">{label}</div>
    <div
      className={`${fontSize} font-bold text-white flex items-center gap-2 ${
        className || ""
      }`}
    >
      {icon && <span>{icon}</span>}
      {value !== undefined ? value : "-"}
    </div>
  </div>
);
