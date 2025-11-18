import React from "react";

interface FormSectionProps {
  label: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ label, children }) => {
  return (
    <div>
      <label className="block text-cyan-100 mb-2">{label}</label>
      {children}
    </div>
  );
}; 