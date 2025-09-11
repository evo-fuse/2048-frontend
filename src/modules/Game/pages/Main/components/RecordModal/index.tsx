import { useRecordContext } from "../../../../../../context";
import Modal from "../../../../../../components/Modal";
import { useMemo, useState } from "react";
import { IoMdDownload } from "react-icons/io";
import { MdFileUpload } from "react-icons/md";
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
    }),
    [activity, total, rows, cols]
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
      alert("Recording uploaded successfully!");
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
          Current Move: {activity.length}
        </div>
        <div className="w-full flex items-center text-white">
          Duration Time:{" "}
          {activity.length > 0 &&
            activity[activity.length - 1].timestamp - activity[0].timestamp}
          ms
        </div>
        <div className="w-full flex items-center text-white">
          Total Score: {total}
        </div>

        <div className="w-full flex justify-center gap-4 mt-4">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 text-white py-2 px-4 rounded transition border-2 border-white/20 bg-white/10 hover:bg-white/40"
            disabled={activity.length === 0}
          >
            <IoMdDownload />
            Export to Local
          </button>
          <button
            onClick={handleUploadToServer}
            className="flex items-center gap-2 text-white py-2 px-4 rounded transition border-2 border-white/20 bg-black/10 hover:bg-black/40"
            disabled={uploading || activity.length === 0}
          >
            <MdFileUpload />
            {uploading ? "Uploading..." : "Save on Online"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RecordModal;
