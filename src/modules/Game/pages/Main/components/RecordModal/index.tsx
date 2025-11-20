import { useAuthContext, useRecordContext } from "../../../../../../context";
import Modal from "../../../../../../components/Modal";
import { useMemo, useState, useEffect } from "react";
import { IoMdDownload } from "react-icons/io";
import { MdCheck, MdFileUpload } from "react-icons/md";
import api from "../../../../../../utils/api";

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  rows: number;
  cols: number;
}

const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  total,
  rows,
  cols,
}) => {
  const { activity, setActivity } = useRecordContext();
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { user, handleExistWallet } = useAuthContext();
  const [walletExists, setWalletExists] = useState(false);

  useEffect(() => {
    if (isOpen) {
      handleExistWallet().then((exists) => {
        setWalletExists(exists);
      });
      // Reset upload success state when modal opens
      setUploadSuccess(false);
    }
  }, [isOpen, handleExistWallet]);

  const recordData = useMemo(
    () => ({
      date: new Date().toISOString(),
      move: activity.length,
      score: total,
      rows,
      cols,
      playTime:
        activity.length > 0
          ? activity[activity.length - 1].timestamp - activity[0].timestamp
          : 0,
      playHistory: activity,
      user,
    }),
    [activity, total, rows, cols, user]
  );

  const handleModalClose = () => {
    setActivity([]);
    onClose();
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(recordData);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileName = `game-recording-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileName);
    linkElement.style.display = "none";
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };

  const handleUploadToServer = async () => {
    setUploading(true);
    try {
      await api({}).post("/records", {
        ...recordData,
        playHistory: JSON.stringify(activity),
      });
      setUploadSuccess(true);
    } catch (error) {
      console.error("Error uploading recording:", error);
      alert("Failed to upload recording. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Activity Recording"
      closeOnOutsideClick={false}
    >
      <div className="w-full px-4 pb-4 flex flex-col gap-2">
        <div className="w-full flex items-center text-white">
          Current Move: <span className="font-bold text-cyan-300 ml-2">{activity.length}</span>
        </div>
        <div className="w-full flex items-center text-white">
          Duration Time:{" "}
          <span className="font-bold text-cyan-300 ml-2">
            {activity.length > 0 &&
              activity[activity.length - 1].timestamp - activity[0].timestamp}
            ms
          </span>
        </div>
        <div className="w-full flex items-center text-white">
          Total Score: <span className="font-bold text-cyan-300 ml-2">{total}</span>
        </div>

        <div className="w-full flex justify-center gap-4 mt-4">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 text-white py-2 px-4 rounded transition border-2 border-cyan-400/20 bg-cyan-900/20 hover:bg-cyan-800/40"
            disabled={activity.length === 0}
          >
            <IoMdDownload />
            Export to Local
          </button>
          <button
            onClick={handleUploadToServer}
            className="flex items-center gap-2 text-white py-2 px-4 rounded transition border-2 border-cyan-400/20 bg-cyan-900/20 hover:bg-cyan-800/40 disabled:opacity-50 cursor-none"
            disabled={uploading || activity.length === 0 || !walletExists || uploadSuccess}
          >
            {uploadSuccess ? <MdCheck /> : <MdFileUpload />}
            {uploading ? "Uploading..." : uploadSuccess ? "Saved" : "Save on Online"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RecordModal;
