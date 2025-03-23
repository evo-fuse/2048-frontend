interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
  }

export const PasswordInput: React.FC<PasswordInputProps> = ({ label, error, ...props }) => {
  return (
    <div className="flex flex-col text-lg font-bold text-white">
      <label>{label}</label>
      <input
        type="password"
        className="focus:outline-none cursor-none bg-transparent border border-white py-1 ps-4 text-white text-lg font-bold rounded-md"
        {...props}
      />
      <label className="text-sm text-red-500">{error}</label>
    </div>
  );
};
