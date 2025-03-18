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
    <img
      src={isOpen ? Images.Check : Images.Uncheck}
      onClick={onToggle}
      width={size}
    />
  );
};
