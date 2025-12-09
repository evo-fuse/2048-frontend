import { useAuthContext } from "../../../../../context";
import { motion } from "framer-motion";
import { useWeb3Context } from "../../../../../context/Web3Context";
import { useEffect, useState, useRef } from "react";
import { MdOutlineStyle } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { IoWalletOutline, IoCameraOutline } from "react-icons/io5";
import { FaUser, FaChartLine, FaBox, FaTrophy, FaSave } from "react-icons/fa";
import { PiTarget } from "react-icons/pi";
import { BsGrid3X3Gap } from "react-icons/bs";
import { useGameContext } from "../../../context";
import Modal from "../../../../../components/Modal";

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
  const { user, handleUploadAvatar, setUser, handleUpdateUser } = useAuthContext();
  const { createdThemes, getCreatedThemes } = useGameContext();
  const { userBalance, getBalance } = useWeb3Context();
  const [screenSize, setScreenSize] = useState<ScreenSize>(getScreenSize(window.innerWidth));
  const [isUploading, setIsUploading] = useState(false);
  const [isThemesModalOpen, setIsThemesModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getBalance();
    getCreatedThemes();

    const handleResize = () => setScreenSize(getScreenSize(window.innerWidth));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getBalance, getCreatedThemes]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const isMobile = screenSize === 'mobile';
  const isTablet = screenSize === 'tablet';
  const isLaptop = screenSize === 'laptop';

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const result = await handleUploadAvatar(file);
      if (result.user && user) {
        setUser({ ...user, avatar: result.user.avatar });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      const updatedUser = await handleUpdateUser({
        name: name.trim() || undefined,
        email: email.trim() || undefined,
      });

      if (updatedUser && setUser) {
        setUser({ ...user, name: updatedUser.name, email: updatedUser.email });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Responsive classes
  const styles = {
    padding: isMobile ? 'px-3 pt-2 pb-2' : isTablet ? 'px-4 pt-3 pb-3' : isLaptop ? 'px-6 pt-4 pb-4' : 'px-8 pt-4 pb-4',
    titleSize: isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl',
    titleMargin: isMobile ? 'mb-2' : isTablet ? 'mb-3' : 'mb-3',
    borderMargin: isMobile ? 'mb-2' : isTablet ? 'mb-3' : 'mb-3',
    itemGap: isMobile ? 'gap-2' : isTablet ? 'gap-3' : 'gap-4',
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
        onClick={() => setIsThemesModalOpen(true)}
        clickable
      />
    </>
  );

  return (
    <div className={`flex flex-col w-full h-full items-center justify-start text-white overflow-hidden`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full h-full flex flex-col ${styles.padding} relative`}
      >
        {/* Profile Title */}
        <div className={`${styles.titleSize} font-bold text-center ${styles.titleMargin} bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent relative z-10 flex-shrink-0 flex items-center justify-center gap-3`}>
          <FaUser className="text-cyan-400" />
          Profile
        </div>

        {/* Content Container */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Profile Information Section */}
          <div className={`bg-gradient-to-br from-cyan-500/5 to-purple-500/5 backdrop-blur-sm rounded-xl shadow-lg border border-cyan-500/20 ${isMobile ? 'p-3 mb-3' : isTablet ? 'p-4 mb-3' : 'p-4 mb-4'} flex-shrink-0`}>
            <div className={`flex ${isMobile ? 'flex-col items-center gap-3' : 'flex-row items-start gap-4'}`}>
              {/* Avatar Section */}
              <div className="relative group flex-shrink-0">
                <div
                  className={`relative ${isMobile ? 'w-20 h-20' : isTablet ? 'w-24 h-24' : 'w-28 h-28'} rounded-full overflow-hidden border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-200 cursor-none ${isUploading ? 'opacity-50' : ''}`}
                  onClick={handleAvatarClick}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                      <FaUser className={`${isMobile ? 'text-3xl' : isTablet ? 'text-4xl' : 'text-5xl'} text-cyan-400/50`} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <IoCameraOutline className={`${isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'} text-white`} />
                  </div>
                </div>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Name and Email Inputs */}
              <div className={`flex-1 flex flex-col gap-2 ${isMobile ? 'w-full' : ''}`}>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name (optional)"
                    className="w-full px-3 py-1.5 text-sm bg-cyan-900/30 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email (optional)"
                    className="w-full px-3 py-1.5 text-sm bg-cyan-900/30 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  />
                </div>
                <div className="w-full flex items-center justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="max-w-min text-nowrap flex items-center justify-center gap-2 px-3 py-1.5 text-sm bg-cyan-500/30 hover:bg-cyan-500/40 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-none mt-1"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Save Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={`flex flex-col w-full relative z-10 flex-1 min-h-0`}>
            {/* Tablet Layout - Vertical Stack */}
            {isTablet && (
              <div className="flex flex-col space-y-3 flex-shrink-0">
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
              <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
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
                <div className="flex flex-col space-y-2">
                  <div className={`w-full h-min grid ${styles.gridCols} ${styles.itemGap}`}>{renderGameStats()}</div>
                  <div className="border-t border-cyan-200 my-3" />
                  <div className={`w-full grid ${styles.gridCols} ${styles.itemGap}`}>{renderInventory()}</div>
                  <div className="border-t border-cyan-200 my-3" />
                  <div className={`w-full h-min grid ${styles.gridCols} ${styles.itemGap}`}>{renderWalletThemes()}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Themes Modal */}
        <Modal
          isOpen={isThemesModalOpen}
          onClose={() => setIsThemesModalOpen(false)}
          title="Created Themes"
          maxWidth="max-w-4xl"
        >
          <div className="flex flex-col gap-4">
            {createdThemes.length === 0 ? (
              <div className="text-center py-8 text-cyan-300">
                <MdOutlineStyle className="text-5xl mx-auto mb-4 opacity-50" />
                <p className="text-lg">No themes created yet</p>
              </div>
            ) : (
              <div className={`grid ${isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-4'} gap-4 max-h-[60vh] overflow-y-auto`}>
                {createdThemes.map((theme, index) => (
                  <div
                    key={`${theme.uuid}-${index}`}
                    className="flex flex-col gap-2 group cursor-none"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-cyan-500/30 group-hover:border-cyan-400 transition-all duration-200">
                      <img
                        src={theme[2].sm}
                        alt={theme.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-cyan-300 truncate">{theme.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
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
  onClick?: () => void;
  clickable?: boolean;
}

const ProfileItem: React.FC<ProfileItemProps> = ({
  label,
  value,
  icon,
  className = "",
  fontSize = "text-xl",
  screenSize = 'desktop',
  onClick,
  clickable = false,
}) => {
  const isMobile = screenSize === 'mobile';
  const isTablet = screenSize === 'tablet';
  const isLaptop = screenSize === 'laptop';

  const itemStyles = {
    padding: isMobile || isTablet ? 'p-3' : 'p-4',
    labelSize: isMobile || isTablet ? 'text-xs' : 'text-sm',
    valueSize: isMobile ? 'text-sm' : isTablet ? 'text-base' : isLaptop ? 'text-lg' : fontSize,
    iconSize: isMobile ? 'text-base' : isTablet ? 'text-lg' : 'text-xl',
  };

  return (
    <div
      className={`bg-gradient-to-br from-cyan-500/5 to-purple-500/5 backdrop-blur-sm rounded-xl shadow-lg border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-xl transition-all duration-200 ${itemStyles.padding} group ${clickable ? 'cursor-none' : ''}`}
      onClick={clickable ? onClick : undefined}
    >
      <div className={`text-cyan-300 ${itemStyles.labelSize} font-medium uppercase tracking-wide mb-2`}>
        {label}
      </div>
      <div className={`${itemStyles.valueSize} font-bold text-white flex items-center gap-3 ${className}`}>
        {icon && (
          <span className={`${itemStyles.iconSize} transition-transform duration-300 group-hover:scale-110 ${typeof icon === 'string' ? '' : 'text-cyan-300'}`}>
            {icon}
          </span>
        )}
        <span className="flex-1 text-lg">{value ?? "-"}</span>
      </div>
    </div>
  );
};
