import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ label, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col text-lg font-bold text-white">
      <label>{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="cursor-none bg-transparent border border-white py-1 ps-4 pe-10 text-white text-lg font-bold rounded-md w-full"
          role="textbox"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>
      <label className="text-sm text-red-500">{error}</label>
    </div>
  );
};
