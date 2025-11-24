import React from "react";
import { FormSection } from "../../../../../common/components/FormSection";
import { RadioGroup } from "../../../../../common/components/RadioGroup";

interface ThemeBasicInfoProps {
  title: string;
  setTitle: (title: string) => void;
  visibility: "private" | "public" | "premium";
  setVisibility: (visibility: "private" | "public" | "premium") => void;
  price: number;
  setPrice: (price: number) => void;
  description: string;
  setDescription: (description: string) => void;
}

export const ThemeBasicInfo: React.FC<ThemeBasicInfoProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  visibility,
  setVisibility,
  price,
  setPrice,
}) => {
  const visibilityOptions = [
    { value: "private", label: "Private" },
    { value: "public", label: "Public" },
    { value: "premium", label: "Premium" },
  ];

  return (
    <>
      <FormSection label="Theme Title: (required)">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-700/50 text-white border border-cyan-500/30 rounded-md p-2 focus:border-cyan-400/50 focus:outline-none"
          placeholder="Enter theme title"
        />
      </FormSection>

      <FormSection label="Theme Description: (required)">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-gray-700/50 text-white border border-cyan-500/30 rounded-md p-2 focus:border-cyan-400/50 focus:outline-none"
          placeholder="Enter theme description"
        />
      </FormSection>

      <FormSection label="Visibility: (required)">
        <RadioGroup
          options={visibilityOptions}
          value={visibility}
          onChange={(value) => setVisibility(value as "private" | "public" | "premium")}
        />
      </FormSection>

      {visibility === "premium" && (
        <FormSection label="Price (USD)">
          <input
            value={price}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setPrice(0);
              } else {
                const parsed = parseFloat(value);
                if (!isNaN(parsed)) {
                  setPrice(parsed);
                }
              }
            }}
            className="w-full bg-gray-700/50 text-white border border-cyan-500/30 rounded-md p-2 focus:border-cyan-400/50 focus:outline-none"
            placeholder="Enter price"
          />
          <p className="mt-2 text-sm text-cyan-300/70">
            Note: A 10% platform fee will be applied to all sales. Your net earnings will be ${(price * 0.9).toFixed(2)} per sale.
          </p>
        </FormSection>
      )}
    </>
  );
}; 