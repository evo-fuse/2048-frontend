import { useState, useRef, useCallback } from "react";

interface UseDragAndDropOptions {
  onFileProcess: (file: File) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
}

interface UseDragAndDropReturn {
  isDragOver: boolean;
  error: string;
  fileName: string;
  dragHandlers: {
    onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  };
  fileInputHandlers: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  clearError: () => void;
  reset: () => void;
}

export const useDragAndDrop = ({
  onFileProcess,
  acceptedFileTypes = [".json"],
  maxFileSize,
}: UseDragAndDropOptions): UseDragAndDropReturn => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const dragCounter = useRef<number>(0);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!acceptedFileTypes.includes(fileExtension)) {
      return `Please upload a ${acceptedFileTypes.join(', ')} file only.`;
    }

    // Check file size if specified
    if (maxFileSize && file.size > maxFileSize) {
      const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(1);
      return `File size must be less than ${maxSizeMB}MB.`;
    }

    return null;
  }, [acceptedFileTypes, maxFileSize]);

  const processFile = useCallback((file: File) => {
    setError("");
    setFileName(file.name);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setFileName("");
      return;
    }

    onFileProcess(file);
  }, [onFileProcess, validateFile]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
      e.dataTransfer.clearData();
    }
  }, [processFile]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  }, [processFile]);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const reset = useCallback(() => {
    setIsDragOver(false);
    setError("");
    setFileName("");
    dragCounter.current = 0;
  }, []);

  return {
    isDragOver,
    error,
    fileName,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
    fileInputHandlers: {
      onChange: handleFileInputChange,
    },
    clearError,
    reset,
  };
};
