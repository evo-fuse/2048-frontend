import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectOption {
  value: string | number;
  label: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    options.find(option => option.value === value) || null
  );
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedOption(options.find(option => option.value === value) || null);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: SelectOption) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      ref={selectRef}
      className={`relative ${className} cursor-none`}
    >
      <div
        onClick={toggleDropdown}
        className={`border border-cyan-400/30 cursor-none flex items-center justify-between px-2 py-2 bg-cyan-950/30 rounded-lg min-w-48 relative z-20 transition-all ${disabled ? 'opacity-50 cursor-none' : 'hover:bg-cyan-900/40'
          }`}
      >
        <span className={`text-white ${!selectedOption ? 'text-cyan-300/40' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-cyan-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-30 w-full mt-1 bg-cyan-950/30 border border-cyan-400/30 rounded-lg shadow-lg shadow-cyan-500/20 max-h-60 overflow-auto backdrop-blur-md"
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className={`px-4 py-2 cursor-none hover:bg-cyan-900/40 transition-colors
                  ${selectedOption?.value === option.value
                    ? 'bg-cyan-900/50 text-cyan-400'
                    : 'text-white'
                  }`
                }
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
