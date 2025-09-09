import { motion } from 'framer-motion';

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
  const isActive = selectedTab === id;
  
  return (
    <div 
      className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 overflow-auto ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'} ${className}`}
      id={`panel-${id}`}
      role="tabpanel"
      aria-labelledby={id}
      aria-hidden={!isActive}
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
