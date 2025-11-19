import React from "react";
import Modal from "../../../../../components/Modal";
import { FaCheckCircle } from "react-icons/fa";

interface PurchaseSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    items?: Array<{ name: string; quantity: number }>;
    gridInfo?: { oldSize: string; newSize: string };
}

export const PurchaseSuccessModal: React.FC<PurchaseSuccessModalProps> = ({
    isOpen,
    onClose,
    title,
    items,
    gridInfo,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Purchase Successful"
            maxWidth="max-w-md"
        >
            <div className="flex flex-col items-center gap-4 p-4">
                <div className="flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-full">
                    <FaCheckCircle className="text-cyan-400 text-4xl" />
                </div>

                <h3 className="text-white text-xl font-bold text-center">{title}</h3>

                {items && items.length > 0 && (
                    <div className="w-full bg-gradient-to-br from-cyan-500/5 to-purple-500/5 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/20">
                        <h4 className="text-cyan-400 font-semibold mb-3">Items Purchased:</h4>
                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center text-white"
                                >
                                    <span>{item.name}</span>
                                    <span className="font-bold">x{item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {gridInfo && (
                    <div className="w-full bg-gradient-to-br from-cyan-500/5 to-purple-500/5 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/20">
                        <h4 className="text-cyan-400 font-semibold mb-3">Grid Updated:</h4>
                        <div className="flex items-center justify-center gap-3 text-white text-lg">
                            <span className="font-bold">{gridInfo.oldSize}</span>
                            <span className="text-cyan-400">→</span>
                            <span className="font-bold text-cyan-400">{gridInfo.newSize}</span>
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full bg-cyan-500/80 hover:bg-cyan-400/80 text-white font-bold py-3 rounded-md transition-colors cursor-none mt-2"
                >
                    Continue Shopping
                </button>
            </div>
        </Modal>
    );
};

