import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Images } from '../assets/images';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
  closeOnOutsideClick = true,
  showCloseButton = true,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Handle outside click
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOutsideClick}
        >
          <motion.div
            ref={modalRef}
            className={`${maxWidth} w-full bg-gray-800/80 border border-white/20 rounded-lg shadow-xl overflow-hidden ${className}`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {(title || showCloseButton) && (
              <div className="flex items-center p-4 gap-2 w-full">
                <img src={Images.LOGO} alt="Logo" className="w-8 h-auto" />
                <div className="flex justify-between items-center border-gray-700 bg-transparent w-full">
                  {title && (
                    <h3 className="text-lg font-medium text-white">{title}</h3>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-300"
                      aria-label="Close"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
