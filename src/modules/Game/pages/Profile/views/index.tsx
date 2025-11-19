import { useAuthContext } from "../../../../../context";
import { motion } from "framer-motion";
import { useWeb3Context } from "../../../../../context/Web3Context";
import { useEffect, useState } from "react";
import { MdOutlineStyle } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { IoWalletOutline } from "react-icons/io5";
import { FaUser, FaChartLine, FaBox, FaPalette, FaTrophy } from "react-icons/fa";
import { PiTarget } from "react-icons/pi";
import { BsGrid3X3Gap } from "react-icons/bs";
import { useGameContext } from "../../../context";
import { css } from "@emotion/css";

const themesScrollbarStyles = css`
  &::-webkit-scrollbar {
    height: 4px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(6, 182, 212, 0.5);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(6, 182, 212, 0.7);
  }

  scrollbar-width: thin;
  scrollbar-color: rgba(6, 182, 212, 0.5) transparent;
`;

type ScreenSize = 'mobile' | 'tablet' | 'laptop' | 'desktop';

const getScreenSize = (width: number): ScreenSize => {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1440) return 'laptop';
  return 'desktop';
};

interface ProfileSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, icon, children, className = '' }) => (
  <div className={`flex flex-col space-y-4 ${className}`}>
    <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

export const ProfileView: React.FC = () => {
  const { user } = useAuthContext();
  const { createdThemes, getCreatedThemes } = useGameContext();
  const { userBalance, getBalance } = useWeb3Context();
  const [screenSize, setScreenSize] = useState<ScreenSize>(getScreenSize(window.innerWidth));

  useEffect(() => {
    getBalance();
    getCreatedThemes();

    const handleResize = () => setScreenSize(getScreenSize(window.innerWidth));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getBalance, getCreatedThemes]);

  const isMobile = screenSize === 'mobile';
  const isTablet = screenSize === 'tablet';
  const isLaptop = screenSize === 'laptop';

  // Responsive classes
  const styles = {
    padding: isMobile ? 'px-3 pt-4 pb-4' : isTablet ? 'px-4 pt-5 pb-5' : isLaptop ? 'px-6 pt-6 pb-6' : 'p-8',
    titleSize: isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl',
    titleMargin: isMobile ? 'mb-4' : isTablet ? 'mb-5' : 'mb-6',
    borderMargin: isMobile ? 'mb-3' : isTablet ? 'mb-4' : 'mb-4',
    itemGap: isMobile ? 'gap-3' : isTablet ? 'gap-4' : 'gap-6',
    gridCols: isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3',
    themeGap: isMobile ? 'gap-3' : isTablet ? 'gap-4' : 'gap-5',
    themeSize: isMobile ? 'w-24 h-24' : isTablet ? 'w-28 h-28' : isLaptop ? 'w-28 h-28' : 'w-32 h-32',
  };

  // Profile sections data
  const renderGameStats = () => (
    <>
      <ProfileItem label="Grid Size" value={`${user?.rows || 0}x${user?.cols || 0}`} icon={<BsGrid3X3Gap size={32} />} screenSize={screenSize} />
      <ProfileItem label="Max Score" value={user?.maxScore || 0} icon={<PiTarget size={32} />} screenSize={screenSize} />
      <ProfileItem label="Max Tile" value={user?.maxTile || 0} icon={<FaTrophy size={32} />} screenSize={screenSize} />
    </>
  );

  const renderInventory = () => (
    <>
      <ProfileItem label="Hammers" value={user?.hammer || 0} icon="🔨" screenSize={screenSize} />
      <ProfileItem label="Power-ups" value={user?.powerup || 0} icon="⚡" screenSize={screenSize} />
      <ProfileItem label="Upgrades" value={user?.upgrade || 0} icon="⬆️" screenSize={screenSize} />
    </>
  );

  const renderWalletThemes = () => (
    <>
      <ProfileItem
        label="Wallet Address"
        value={user?.address ? user?.address.slice(0, 7) + "..." + user?.address.slice(-5) : "No Address"}
        icon={<IoWalletOutline size={32} />}
        className="break-all"
        screenSize={screenSize}
      />
      <ProfileItem
        label="Wallet Balance"
        value={userBalance ? `${userBalance} DWAT` : "No Balance"}
        icon={<GiMoneyStack size={32} />}
        screenSize={screenSize}
      />
      <ProfileItem
        label="Total Themes"
        value={user?.countThemes || "No Themes"}
        icon={<MdOutlineStyle size={32} />}
        screenSize={screenSize}
      />
    </>
  );

  return (
    <div className={`flex flex-col w-full h-full items-center justify-start text-white ${isMobile || isTablet ? `overflow-y-auto ${themesScrollbarStyles}` : 'overflow-hidden'}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full ${isMobile || isTablet ? 'min-h-full' : 'h-full'} flex flex-col ${styles.padding} relative`}
      >
        <div className={`${styles.titleSize} font-bold text-center ${styles.titleMargin} bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent relative z-10 flex-shrink-0 flex items-center justify-center gap-3`}>
          <FaUser className="text-cyan-400" />
          Profile
        </div>

        <div className={`flex flex-col w-full ${isMobile || isTablet ? '' : 'h-full'} relative z-10 ${isMobile || isTablet ? '' : 'overflow-hidden'}`}>
          {/* Tablet Layout - Vertical Stack */}
          {isTablet && (
            <div className="flex flex-col space-y-6 mb-6 flex-shrink-0">
              <ProfileSection title="Game Statistics" icon={<FaChartLine />}>
                <div className="grid grid-cols-3 gap-4">{renderGameStats()}</div>
              </ProfileSection>

              <div className="border-t border-cyan-700/50" />

              <ProfileSection title="Inventory" icon={<FaBox />}>
                <div className="grid grid-cols-3 gap-4">{renderInventory()}</div>
              </ProfileSection>

              <div className="border-t border-cyan-700/50" />

              <ProfileSection title="Wallet & Themes" icon={<MdOutlineStyle />}>
                <div className="flex flex-col space-y-4">{renderWalletThemes()}</div>
              </ProfileSection>
            </div>
          )}

          {/* Laptop & Desktop Layout - Horizontal 3 Columns */}
          {!isMobile && !isTablet && (
            <div className="grid grid-cols-3 gap-6 mb-6 flex-shrink-0">
              <ProfileSection title="Game Statistics" icon={<FaChartLine />}>
                <div className="flex flex-col space-y-4">{renderGameStats()}</div>
              </ProfileSection>

              <ProfileSection title="Inventory" icon={<FaBox />} className="border-l border-r border-cyan-700/50 px-6">
                <div className="flex flex-col space-y-4">{renderInventory()}</div>
              </ProfileSection>

              <ProfileSection title="Wallet & Themes" icon={<MdOutlineStyle />}>
                <div className="flex flex-col space-y-4">{renderWalletThemes()}</div>
              </ProfileSection>
            </div>
          )}

          {isMobile && (
            <>
              <div className={`border-t border-cyan-200 ${styles.borderMargin} flex-shrink-0`} />
              <div className="flex flex-col space-y-4">
                <div className={`w-full h-min grid ${styles.gridCols} ${styles.itemGap}`}>{renderGameStats()}</div>
                <div className="border-t border-cyan-200 my-3" />
                <div className={`w-full grid ${styles.gridCols} ${styles.itemGap}`}>{renderInventory()}</div>
                <div className="border-t border-cyan-200 my-3" />
                <div className={`w-full h-min grid ${styles.gridCols} ${styles.itemGap}`}>{renderWalletThemes()}</div>
              </div>
            </>
          )}
          <div className={`border-t ${isMobile ? 'border-cyan-200 my-3' : 'border-cyan-700/50 my-6'} flex-shrink-0`} />
          <div className={`text-sm font-semibold uppercase flex-shrink-0 ${isMobile ? 'mb-3' : isTablet ? 'mb-4' : 'mb-5'} text-cyan-400 flex items-center gap-2`}>
            <FaPalette />
            Latest Created Themes
          </div>
          <div className={`w-full flex flex-wrap ${styles.themeGap} ${isMobile ? '' : 'overflow-y-auto overflow-x-hidden'} pb-2 ${isMobile ? '' : 'flex-1 min-h-0'} ${themesScrollbarStyles}`}>
            {createdThemes.map((theme, index) => (
              <img
                key={`${theme.uuid}-${index}`}
                src={theme[2].sm}
                alt={theme.title}
                className={`${styles.themeSize} object-cover rounded-md`}
              />
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
  screenSize?: ScreenSize;
}

const ProfileItem: React.FC<ProfileItemProps> = ({
  label,
  value,
  icon,
  className = "",
  fontSize = "text-xl",
  screenSize = 'desktop',
}) => {
  const isMobile = screenSize === 'mobile';
  const isTablet = screenSize === 'tablet';
  const isLaptop = screenSize === 'laptop';

  const itemStyles = {
    padding: isMobile || isTablet ? 'p-4' : 'p-5',
    labelSize: isMobile || isTablet ? 'text-xs' : 'text-sm',
    valueSize: isMobile ? 'text-base' : isTablet ? 'text-lg' : isLaptop ? 'text-xl' : fontSize,
    iconSize: isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl',
  };

  return (
    <div className={`bg-cyan-900/80 rounded-xl shadow-lg border border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-xl transition-all duration-300 backdrop-blur-sm ${itemStyles.padding} group`}>
      <div className={`text-cyan-300 ${itemStyles.labelSize} font-medium uppercase tracking-wide mb-2`}>
        {label}
      </div>
      <div className={`${itemStyles.valueSize} font-bold text-white flex items-center gap-3 ${className}`}>
        {icon && (
          <span className={`${itemStyles.iconSize} transition-transform duration-300 group-hover:scale-110 ${typeof icon === 'string' ? '' : 'text-cyan-300'}`}>
            {icon}
          </span>
        )}
        <span className="flex-1 text-2xl">{value ?? "-"}</span>
      </div>
    </div>
  );
};
