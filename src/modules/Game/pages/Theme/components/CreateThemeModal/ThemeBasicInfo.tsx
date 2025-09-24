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
          className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"
          placeholder="Enter theme title"
        />
      </FormSection>

      <FormSection label="Theme Description: (required)">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"
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
            type="number"
            min="1"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"
            placeholder="Enter price"
          />
          <p className="mt-2 text-sm text-gray-400">
            Note: A 10% platform fee will be applied to all sales. Your net earnings will be ${(price * 0.9).toFixed(2)} per sale.
          </p>
        </FormSection>
      )}
    </>
  );
}; 