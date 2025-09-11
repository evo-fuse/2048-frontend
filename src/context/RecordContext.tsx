import { useOpen } from "../hooks";
import { Tile } from "../modules/Game/pages/Main/hooks/useGameBoard";
import { Vector } from "../modules/Game/pages/Main/utils/types";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
} from "react";

type RecordContextType = {
  recording: boolean;
  setRecording: (recording: boolean) => void;
  activity: Activity[];
  setActivity: (activity: Activity[]) => void;
  replay: Activity[];
  setReplay: (replay: Activity[]) => void;
  isRecordOpen: boolean;
  onRecordOpen: () => void;
  onRecordClose: () => void;
};

export type Activity = {
  vector: Vector;
  timestamp: number;
  tiles: Tile[];
};

export const RecordContext = createContext<RecordContextType | undefined>(
  undefined
);

export const RecordProvider = ({ children }: { children: ReactNode }) => {
  const [recording, setRecording] = useState(false);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [replay, setReplay] = useState<Activity[]>([]);
  const {
    isOpen: isRecordOpen,
    onOpen: onRecordOpen,
    onClose: onRecordClose,
  } = useOpen();
  return (
    <RecordContext.Provider
      value={{
        recording,
        setRecording,
        activity,
        setActivity,
        replay,
        setReplay,
        isRecordOpen,
        onRecordOpen,
        onRecordClose,
      }}
    >
      {children}
    </RecordContext.Provider>
  );
};

export const useRecordContext = () => {
  const context = useContext(RecordContext);
  if (context === undefined) {
    throw new Error("useRecordContext must be used within a RecordProvider");
  }
  return context;
};
