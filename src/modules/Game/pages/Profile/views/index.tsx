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
    <div className="w-full h-full text-white flex gap-4">
      <div className="w-full flex flex-col gap-4">
        {/* Header with gradient accent */}
        <div className="relative">
          <h2 className="text-2xl font-bold py-6 px-8 border-b border-white/10">
            Profile
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full flex flex-col items-center gap-6 px-8 py-4"
        >
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4">
              <ProfileItem
                label="Grid Size"
                value={user?.rows && user?.cols ? `${user?.rows}x${user?.cols}` : "4 x 4"}
              />
              <ProfileItem label="Max Score" value={user?.maxScore} />
              <ProfileItem label="Max Tile" value={user?.maxTile} />
            </div>
            <div className="flex gap-4">
              <ProfileItem label="Hammers" value={user?.hammer} icon="🔨" />
              <ProfileItem label="Power-ups" value={user?.powerup} icon="⚡" />
              <ProfileItem label="Upgrades" value={user?.upgrade} icon="⬆️" />
            </div>
            <div className="flex gap-4">
              <ProfileItem
                label="Wallet Address"
                value={
                  user?.address ? user?.address.slice(0, 8) + "..." + user?.address.slice(-6) : "No Wallet"
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
          <div className="border-t border-white/10 my-4 w-full max-w-5xl" />
          <div className="text-2xl font-bold w-full max-w-5xl">Latest Created Themes</div>
          <div className="w-full max-w-5xl flex flex-wrap gap-4">
            {createdThemes.map((theme) => (
              <div key={theme.uuid} className="flex shadow-md shadow-black rounded-md">
                <img src={theme[2].sm} alt={theme.title} className="w-32" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
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
  <div className="bg-gray-800/60 rounded-lg p-3 shadow-md border border-white/10 hover:border-white/20 transition-all w-full">
    <div className="text-gray-200 text-xs mb-1">{label}</div>
    <div
      className={`${fontSize} font-bold text-white flex items-center gap-2 ${className || ""
        }`}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span>{value !== undefined ? value : "-"}</span>
    </div>
  </div>
);
