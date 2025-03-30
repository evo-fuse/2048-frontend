import Modal from "../../../../../../components/Modal";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: string;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  notice,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className="w-full flex items-center justify-center text-center text-xl font-bold text-gray-200 p-4">
        {notice}
      </div>
    </Modal>
  );
};
