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
  const [exportSuccess, setExportSuccess] = useState(false);
  const { user, handleExistWallet } = useAuthContext();
  const [walletExists, setWalletExists] = useState(false);

  useEffect(() => {
    if (isOpen) {
      handleExistWallet().then((exists) => {
        setWalletExists(exists);
      });
      // Reset upload success state when modal opens
      setUploadSuccess(false);
      setExportSuccess(false);
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

  const handleExportJson = async () => {
    const dataStr = JSON.stringify(recordData);
    const exportFileName = `game-recording-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    // Try to use the File System Access API if available (modern browsers)
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: exportFileName,
          types: [
            {
              description: 'JSON Files',
              accept: { 'application/json': ['.json'] },
            },
          ],
        });

        const writable = await handle.createWritable();
        await writable.write(dataStr);
        await writable.close();

        // Only show success if we actually saved the file
        setExportSuccess(true);
      } catch (error: any) {
        // User cancelled the save dialog or an error occurred
        if (error.name !== 'AbortError') {
          console.error('Error saving file:', error);
          alert('Failed to save file. Please try again.');
        }
        // Don't set exportSuccess if user cancelled
      }
    } else {
      // Fallback for browsers that don't support File System Access API
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileName);
      linkElement.style.display = "none";
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);

      // For fallback, we can't know if user saved or cancelled
      // So we don't set exportSuccess to avoid misleading feedback
    }
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
            className="flex items-center gap-2 text-white py-2 px-4 rounded transition border-2 border-cyan-400/20 bg-cyan-900/20 hover:bg-cyan-800/40 disabled:opacity-50 cursor-none"
            disabled={activity.length === 0 || exportSuccess}
          >
            {exportSuccess ? <MdCheck /> : <IoMdDownload />}
            {exportSuccess ? "Saved to Local" : "Export to Local"}
          </button>
          <button
            onClick={handleUploadToServer}
            className="flex items-center gap-2 text-white py-2 px-4 rounded transition border-2 border-cyan-400/20 bg-cyan-900/20 hover:bg-cyan-800/40 disabled:opacity-50 cursor-none"
            disabled={uploading || activity.length === 0 || !walletExists || uploadSuccess}
          >
            {uploadSuccess ? <MdCheck /> : <MdFileUpload />}
            {uploading ? "Uploading..." : uploadSuccess ? "Saved on Online" : "Save on Online"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RecordModal;
