import React from "react";

interface ModalFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  onCancel,
  onSubmit,
  submitDisabled = false,
  submitLabel = "Submit",
  cancelLabel = "Cancel"
}) => {
  return (
    <div className="flex justify-end mt-8">
      <button
        onClick={onCancel}
        className="px-4 py-2 mr-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
      >
        {cancelLabel}
      </button>
      <button
        onClick={onSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50"
        disabled={submitDisabled}
      >
        {submitLabel}
      </button>
    </div>
  );
}; 