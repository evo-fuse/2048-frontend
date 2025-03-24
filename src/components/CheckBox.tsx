import { Images } from "../assets/images";

interface CheckBoxProps {
  isOpen: boolean;
  onToggle: () => void;
  size: number;
}

export const CheckBox: React.FC<CheckBoxProps> = ({
  isOpen,
  onToggle,
  size,
}) => {
  return (
    <div onClick={onToggle} className="cursor-none">
      <img
        src={isOpen ? Images.Check : Images.Uncheck}
        alt="check"
        width={size}
      />
    </div>
  );
};
