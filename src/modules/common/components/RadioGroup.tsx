import React from "react";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <div className="flex space-x-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="radio"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="opacity-0 absolute h-5 w-5"
            />
            <div
              className={`border-2 rounded-full h-5 w-5 flex items-center justify-center ${value === option.value
                ? "border-cyan-500"
                : "border-cyan-500/40"
                }`}
            >
              {value === option.value && (
                <div className="bg-cyan-500 rounded-full h-3 w-3"></div>
              )}
            </div>
          </div>
          <span className="text-cyan-100">{option.label}</span>
        </label>
      ))}
    </div>
  );
}; 