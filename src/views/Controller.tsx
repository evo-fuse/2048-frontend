import { FaWindows } from "react-icons/fa";
import { TiDocumentText } from "react-icons/ti";
import Mouse from "../assets/images/mouse.png";
import { useState } from "react";
import { MenuButton } from "../components";
import { useNavigate } from "react-router-dom";
import { PATH } from "../const";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../assets/images/logo (3).jpeg";

const color = [
  [
    "border-yellow-500",
    "bg-yellow-500/20",
    "hover:bg-yellow-500/10",
    "text-yellow-500",
  ],
  [
    "border-blue-500",
    "bg-blue-500/20",
    "hover:bg-blue-500/10",
    "text-blue-500",
  ],
  ["border-red-500", "bg-red-500/20", "hover:bg-red-500/10", "text-red-500"],
  [
    "border-fuchsia-500",
    "bg-fuchsia-500/20",
    "hover:bg-fuchsia-500/10",
    "text-fuchsia-500",
  ],
  [
    "border-orange-500",
    "bg-orange-500/20",
    "hover:bg-orange-500/10",
    "text-orange-500",
  ],
];

interface KeyProps {
  width?: number;
  value: React.ReactNode;
  checked: boolean;
  category?: number;
}

export const Key: React.FC<KeyProps> = ({
  width,
  value,
  checked,
  category,
}) => {
  return (
    <div
      className={`h-12 w-12 rounded-md bg-transparent border-2 ${
        color[category || 0][0]
      } flex items-center text-yellow-500 font-bold text-lg px-1 ${
        checked ? color[category || 0][1] : color[category || 0][2]
      } ${
        typeof value !== "string" ||
        value?.toString().length === 1 ||
        value?.toString() === "Space"
          ? "justify-center"
          : "justify-start"
      }`}
      style={{ width }}
    >
      {value}
    </div>
  );
};

interface KeyDispProps {
  description: string;
  keyboard: React.ReactNode;
  category?: number;
}

export const KeyDisp: React.FC<KeyDispProps> = ({
  description,
  keyboard,
  category,
}) => {
  return (
    <div
      className={`${color[category || 0][3]} ${
        color[category || 0][0]
      } border-2 font-bold text-md flex items-center justify-between w-[calc(100%-64px)] pl-2 gap-2`}
    >
      {description}:
      <div
        className={`border-l-2 p-1 w-10 h-19 flex items-center justify-center ${
          color[category || 0][0]
        }`}
      >
        {keyboard}
      </div>
    </div>
  );
};

export const ControllerView: React.FC = () => {
  const [showMenu, setShowMenu] = useState(true);
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    setShowMenu(false);
    setTimeout(() => {
      navigate(path);
    }, 500); // Delay showing modal until after menu disappears
  };

  const [keyLayout, _setKeyLayout] = useState<KeyProps[][]>([
    [
      { value: "Esc", width: 62, checked: true, category: 4 },
      { value: "F1", width: 44, checked: false },
      { value: "F2", width: 44, checked: false },
      { value: "F3", width: 44, checked: false },
      { value: "F4", width: 44, checked: false },
      { value: "F5", width: 44, checked: false },
      { value: "F6", width: 44, checked: false },
      { value: "F7", width: 44, checked: false },
      { value: "F8", width: 44, checked: false },
      { value: "F9", width: 44, checked: false },
      { value: "F10", width: 44, checked: false },
      { value: "F11", width: 44, checked: false },
      { value: "F12", width: 44, checked: false },
      { value: "ScrLk", width: 70, checked: false },
      { value: "PrtSc", width: 70, checked: false },
    ],
    [
      { value: "`", checked: false },
      { value: "1", checked: false },
      { value: "2", checked: false },
      { value: "3", checked: false },
      { value: "4", checked: false },
      { value: "5", checked: false },
      { value: "6", checked: false },
      { value: "7", checked: false },
      { value: "8", checked: false },
      { value: "9", checked: false },
      { value: "0", checked: false },
      { value: "-", checked: false },
      { value: "=", checked: false },
      { value: "Backspace", width: 114, checked: false },
    ],
    [
      { value: "Tab", width: 72, checked: false },
      { value: "Q", checked: true, category: 1 },
      { value: "W", checked: true, category: 1 },
      { value: "E", checked: true, category: 1 },
      { value: "R", checked: true, category: 2 },
      { value: "T", checked: true, category: 3 },
      { value: "Y", checked: false },
      { value: "U", checked: false },
      { value: "I", checked: true, category: 3 },
      { value: "O", checked: false },
      { value: "P", checked: true, category: 4 },
      { value: "[", checked: false },
      { value: "]", checked: false },
      { value: "\\", width: 90, checked: false },
    ],
    [
      { value: "CapsLock", width: 100, checked: false },
      { value: "A", checked: true, category: 1 },
      { value: "S", checked: true, category: 1 },
      { value: "D", checked: true, category: 1 },
      { value: "F", checked: true, category: 2 },
      { value: "G", checked: false },
      { value: "H", checked: false },
      { value: "J", checked: false },
      { value: "K", checked: false },
      { value: "L", checked: true, category: 4 },
      { value: ";", checked: false },
      { value: "'", checked: false },
      { value: "Enter", width: 118, checked: false },
    ],
    [
      { value: "Shift", width: 128, checked: false },
      { value: "Z", checked: true, category: 2 },
      { value: "X", checked: true, category: 2 },
      { value: "C", checked: true, category: 2 },
      { value: "V", checked: true, category: 3 },
      { value: "B", checked: true, category: 4 },
      { value: "N", checked: false },
      { value: "M", checked: true, category: 3 },
      { value: ",", checked: false },
      { value: ".", checked: false },
      { value: "/", checked: false },
      { value: "Shift", width: 146, checked: false },
    ],
    [
      { value: "Ctrl", width: 60, checked: false },
      { value: "Fn", checked: false },
      { value: <FaWindows />, checked: false },
      { value: "Alt", checked: false },
      { value: "Space", checked: false, width: 426 },
      { value: "Alt", checked: false },
      { value: <TiDocumentText size={24} />, checked: false },
      { value: "Ctrl", width: 60, checked: false },
    ],
  ]);
  return (
    <AnimatePresence>
      {showMenu && (
        <motion.div className="flex flex-col w-full h-full justify-center">
          <motion.img
            exit={{ opacity: 0, y: -200 }}
            src={Logo}
            className="max-w-[540px] my-4"
          />
          <motion.div
            className="flex flex-col w-full items-center"
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0, transition: {delay: 0.2, duration: 0.3} }}
            exit={{ opacity: 0, x: -200 }}
          >
            <div className="flex w-[1440px] justify-between">
              <div className="flex flex-col max-w-min justify-between gap-2">
                {keyLayout.map((keyRow, idx) => (
                  <div className="flex items-center gap-2" key={idx}>
                    {keyRow.map((k, index) => (
                      <Key
                        value={k.value}
                        width={k.width}
                        checked={k.checked}
                        category={k.category}
                        key={`key-${index}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <img src={Mouse} />
            </div>
          </motion.div>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0, transition: {delay: 0.5, duration: 0.3} }}
            exit={{ opacity: 0, x: 200 }}
          >
            <div className="w-[1440px] grid grid-cols-4 gap-2 pt-4">
              <div className="flex flex-col gap-2 items-start">
                <div className="text-blue-500 text-md font-bold">
                  Movement Controls
                </div>
                <KeyDisp description="Move Forward" keyboard="A" category={1} />
                <KeyDisp
                  description="Move Backward"
                  keyboard="D"
                  category={1}
                />
                <KeyDisp description="Move Left" keyboard="W" category={1} />
                <KeyDisp description="Move Right" keyboard="S" category={1} />
                <KeyDisp description="Strafe Left" keyboard="Q" category={1} />
                <KeyDisp description="Strafe Right" keyboard="E" category={1} />
              </div>
              <div className="flex flex-col gap-2 items-start">
                <div className="text-red-500 text-md font-bold">
                  Combat Controls
                </div>
                <KeyDisp
                  description="Health Potion"
                  keyboard="R"
                  category={2}
                />
                <KeyDisp description="Mana Potion" keyboard="F" category={2} />
                <KeyDisp
                  description="Special Attack"
                  keyboard="Z"
                  category={2}
                />
                <KeyDisp description="Block/Defend" keyboard="X" category={2} />
                <KeyDisp description="Dodge Roll" keyboard="C" category={2} />
              </div>
              <div className="flex flex-col gap-2 items-start">
                <div className="text-fuchsia-500 text-md font-bold">
                  Interaction Controls
                </div>
                <KeyDisp
                  description="Interact with NPC"
                  keyboard="V"
                  category={3}
                />
                <KeyDisp
                  description="Open Inventory"
                  keyboard="I"
                  category={3}
                />
                <KeyDisp description="Open Map" keyboard="M" category={3} />
                <KeyDisp
                  description="Open Quest Log"
                  keyboard="T"
                  category={3}
                />
              </div>
              <div className="flex flex-col gap-2 items-start">
                <div className="text-orange-500 text-md font-bold">
                  Miscellaneous Controls
                </div>
                <KeyDisp
                  description="Open Player Profile"
                  keyboard="P"
                  category={4}
                />
                <KeyDisp
                  description="Open Guild Interface"
                  keyboard="L"
                  category={4}
                />
                <KeyDisp
                  description="Open Marketplace"
                  keyboard="B"
                  category={4}
                />
                <KeyDisp
                  description="Open Game Menu"
                  keyboard="Esc"
                  category={4}
                />
                <div className="flex w-full justify-end pr-16">
                  <MenuButton
                    text="back-sm"
                    width={216}
                    height={80}
                    onClick={() => handleMenuClick(PATH.SETTING)}
                    delay={0}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
