import { motion, AnimatePresence } from 'framer-motion';

interface TabProps {
  tabs: { id: string; label: string }[];
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

const contentVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 }
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
      <div className={`flex relative gap-4 p-2 ${tabsContainerClassName}`} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`relative px-4 py-2 text-sm font-bold transition-colors
              ${
                selectedTab === tab.id
                  ? 'text-orange-400'
                  : 'text-white/60 hover:text-orange-500'
              }`}
            role="tab"
            aria-selected={selectedTab === tab.id}
            aria-controls={`panel-${tab.id}`}
          >
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
        ))}
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
  return (
    <AnimatePresence mode="wait">
      {selectedTab === id && (
        <motion.div
          id={`panel-${id}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={contentVariants}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={className}
          role="tabpanel"
          aria-labelledby={id}
          style={{ position: 'absolute', top: 144 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
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
