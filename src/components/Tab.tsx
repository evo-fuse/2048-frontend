import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { IconType } from 'react-icons';

interface TabProps {
  tabs: { id: string; label: string; icon?: IconType }[];
  selectedTab: string;
  setSelectedTab: (id: string) => void;
  className?: string;
  tabsContainerClassName?: string;
}

const underlineVariants = {
  active: {
    width: '100%',
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
  inactive: { width: '0%' }
};

export const Tabs = ({
  tabs,
  selectedTab,
  setSelectedTab,
  className = '',
  tabsContainerClassName = ''
}: TabProps) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className={`flex relative gap-4 ${tabsContainerClassName}`} role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`relative px-2 xs:px-3 sm:px-4 md:px-5 py-1.5 xs:py-2 sm:py-2.5 md:py-3 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-2xl 3xl:text-2xl font-bold rounded-md sm:rounded-lg transition-colors duration-200 flex items-center gap-1.5 xs:gap-2 sm:gap-2
                ${selectedTab === tab.id
                  ? 'text-cyan-400 bg-white/10 shadow-md'
                  : 'text-white/60 hover:text-cyan-500 hover:bg-white/5'
                }`}
              role="tab"
              aria-selected={selectedTab === tab.id}
              aria-controls={`panel-${tab.id}`}
            >
              {Icon && <Icon className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-2xl 3xl:text-2xl" />}
              {tab.label}
              {selectedTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-primary-500"
                  variants={underlineVariants}
                  initial="inactive"
                  animate="active"
                  layoutId="underline"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface TabPanelProps {
  id: string;
  selectedTab: string;
  children: React.ReactNode;
  className?: string;
}

export const TabPanel = ({
  id,
  selectedTab,
  children,
  className = ''
}: TabPanelProps) => {
  const isActive = selectedTab === id;
  const panelId = `panel-${id}`;

  useEffect(() => {
    // Add global style for hiding scrollbars on tab panels if not already added
    const styleId = 'tab-panel-scrollbar-hide';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        [id^="panel-"]::-webkit-scrollbar {
          display: none;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 overflow-auto ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'} ${className}`}
      id={panelId}
      role="tabpanel"
      aria-labelledby={id}
      aria-hidden={!isActive}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-y",
        overscrollBehavior: "contain",
      }}
    >
      {children}
    </div>
  );
};

// Example usage:
/*
const MyComponent = () => {
  const [selectedTab, setSelectedTab] = useState('tab1');
  
  return (
    <div>
      <Tabs
        tabs={[
          { id: 'tab1', label: 'Tab 1' },
          { id: 'tab2', label: 'Tab 2' }
        ]}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        className="mb-4"
        tabsContainerClassName="border-b border-gray-200"
      />
      
      <TabPanel id="tab1" selectedTab={selectedTab}>
        Content for Tab 1
      </TabPanel>
      
      <TabPanel id="tab2" selectedTab={selectedTab}>
        Content for Tab 2
      </TabPanel>
    </div>
  );
};
*/
