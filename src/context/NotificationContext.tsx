import React, { createContext, useContext, useState, ReactNode } from "react";
import { MdCheckCircle, MdError, MdInfo } from "react-icons/md";
import Modal from "../components/Modal";

type NotificationType = "error" | "success" | "info";

interface Notification {
    type: NotificationType;
    title: string;
    message?: string;
}

interface NotificationContextType {
    showNotification: (type: NotificationType, title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    success: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<Notification | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const showNotification = (type: NotificationType, title: string, message?: string) => {
        setNotification({ type, title, message });
        setIsOpen(true);
    };

    const error = (title: string, message?: string) => {
        showNotification("error", title, message);
    };

    const success = (title: string, message?: string) => {
        showNotification("success", title, message);
    };

    const info = (title: string, message?: string) => {
        showNotification("info", title, message);
    };

    const handleClose = () => {
        setIsOpen(false);
        // Clear notification after animation completes
        setTimeout(() => setNotification(null), 300);
    };

    const getIcon = (type: NotificationType) => {
        const iconProps = { size: 48 };
        switch (type) {
            case "error":
                return <MdError {...iconProps} className="text-red-500" />;
            case "success":
                return <MdCheckCircle {...iconProps} className="text-green-500" />;
            case "info":
                return <MdInfo {...iconProps} className="text-blue-500" />;
        }
    };

    const getTitle = (type: NotificationType) => {
        switch (type) {
            case "error":
                return "Error";
            case "success":
                return "Success";
            case "info":
                return "Information";
        }
    };

    return (
        <NotificationContext.Provider value={{ showNotification, error, success, info }}>
            {children}
            {notification && (
                <Modal
                    isOpen={isOpen}
                    onClose={handleClose}
                    title={getTitle(notification.type)}
                    closeOnOutsideClick={true}
                    showCloseButton={true}
                >
                    <div className="w-full px-6 pb-6 flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center">
                            {getIcon(notification.type)}
                        </div>
                        <div className="flex flex-col gap-2 text-center">
                            <h3 className="text-xl font-bold text-white">{notification.title}</h3>
                            {notification.message && (
                                <p className="text-gray-300 text-sm">{notification.message}</p>
                            )}
                        </div>
                        <button
                            onClick={handleClose}
                            className="mt-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
                        >
                            OK
                        </button>
                    </div>
                </Modal>
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within NotificationProvider");
    }
    return context;
};

