import Modal from "../../../../../components/Modal";
import { IoWarningOutline } from "react-icons/io5";

interface ErrorModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    onClose: () => void;
}

export const ErrorModal = ({ isOpen, title = "Something went wrong", message, onClose }: ErrorModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            maxWidth="max-w-md"
        >
            <div className="p-6 flex gap-4 items-center justify-center">
                <IoWarningOutline className="text-white" size={48} />
                <p className="text-base text-center text-white/90">{message}</p>
            </div>
        </Modal>
    );
};

