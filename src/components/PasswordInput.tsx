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
    <div className="flex flex-col gap-2 text-lg font-bold text-white">
      <label className="text-white">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="cursor-none bg-cyan-500/10 border border-cyan-400/30 focus:border-cyan-400/60 focus:outline-none py-2 ps-4 pe-10 text-white text-sm rounded-xl w-full transition-all duration-200 placeholder-cyan-300/40"
          role="textbox"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-300/80 hover:text-cyan-200 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>
      {error && <label className="text-sm text-red-400">{error}</label>}
    </div>
  );
};
