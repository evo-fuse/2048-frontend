import { useAuthContext } from "../../../../../context";
import { motion } from "framer-motion";
import { Images } from "../../../../../assets/images";

export const ProfileView: React.FC = () => {
  const { user } = useAuthContext();

  return (
    <div className="flex flex-col w-full h-full items-center justify-center text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-700/90 backdrop-blur-sm rounded-xl shadow-lg p-8 relative"
      >
        <img
          src={Images.WalletBg}
          alt="wallet"
          className="w-full h-full absolute top-0 left-0"
        />
        <div className="w-full h-full absolute top-0 left-0 bg-black/50 backdrop-blur-sm" />
        <div className="text-4xl font-bold text-center mb-6 text-white relative z-10">
          Profile
        </div>

        <div className="space-y-4 relative z-10">
          <div className="grid grid-cols-1 gap-4 mb-4">
            <ProfileItem label="Username" value={user?.username} />
            <ProfileItem label="Email" value={user?.email} />
          </div>

          <div className="border-t border-gray-600 my-4"></div>

          <div className="grid grid-cols-2 gap-4">
            <ProfileItem label="Grid Rows" value={user?.rows} />
            <ProfileItem label="Grid Columns" value={user?.cols} />
          </div>

          <div className="border-t border-gray-600 my-4"></div>

          <div className="grid grid-cols-2 gap-4">
            <ProfileItem label="Max Count" value={user?.maxCount} />
            <ProfileItem label="Max Moves" value={user?.maxMoves} />
            <ProfileItem label="Max Score" value={user?.maxScore} />
            <ProfileItem label="Max Tile" value={user?.maxTile} />
          </div>

          <div className="border-t border-gray-600 my-4"></div>

          <div className="grid grid-cols-3 gap-4">
            <ProfileItem label="Hammers" value={user?.hammer} icon="🔨" />
            <ProfileItem label="Power-ups" value={user?.powerup} icon="⚡" />
            <ProfileItem label="Upgrades" value={user?.upgrade} icon="⬆️" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface ProfileItemProps {
  label: string;
  value: any;
  icon?: string;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ label, value, icon }) => (
  <div className="bg-gray-800/60 rounded-lg p-3 shadow-md border border-white/10">
    <div className="text-gray-200 text-sm">{label}</div>
    <div className="text-xl font-bold text-white flex items-center gap-2">
      {icon && <span>{icon}</span>}
      {value !== undefined ? value : "-"}
    </div>
  </div>
);
