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
    <div className="flex justify-end pt-4 pr-4 pb-4 bg-cyan-500/5 rounded-b-2xl">
      <button
        onClick={onCancel}
        className="px-4 py-2 mr-2 bg-gray-700/60 text-cyan-100 rounded-md hover:bg-gray-700/80 transition-colors cursor-none border border-cyan-500/20"
      >
        {cancelLabel}
      </button>
      <button
        onClick={onSubmit}
        className="px-4 py-2 bg-cyan-600/60 text-white rounded-md hover:bg-cyan-600/80 disabled:opacity-50 cursor-none transition-colors border border-cyan-400/30"
        disabled={submitDisabled}
      >
        {submitLabel}
      </button>
    </div>
  );
}; 