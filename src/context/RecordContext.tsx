import api from "../utils/api";
import { useOpen } from "../hooks";
import { Tile } from "../modules/Game/pages/Main/hooks/useGameBoard";
import { Vector } from "../modules/Game/pages/Main/utils/types";
import { createContext, useState, useContext, ReactNode } from "react";
import { User } from "types";

// Records API functions
export interface Record {
  uuid?: string;
  user: User;
  rows: number;
  cols: number;
  score: number;
  move: number;
  playTime: string;
  date: string;
  playHistoryUrl: string;
}

export interface Pagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

export interface RecordsSearchResponse {
  pagination: Pagination;
  filters: {
    startDate?: string;
    endDate?: string;
    myRecordsOnly?: boolean;
    sortBy?: string;
    sortOrder?: string;
  };
  records: Record[];
}

export interface RecordsDateRangeResponse {
  pagination: Pagination;
  filters: {
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  };
  records: Record[];
}

export interface RecordsSearchParams {
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
  myRecordsOnly?: string;
  limit?: number;
  offset?: number;
}

export interface RecordsDateRangeParams {
  startDate: string;
  endDate: string;
  sortBy?: string;
  sortOrder?: string;
  limit?: number;
  offset?: number;
}

// Search records endpoint
export const searchRecords = async (
  params: RecordsSearchParams
): Promise<RecordsSearchResponse> => {
  const apiInstance = api({});
  const response = await apiInstance.get("/records/search", { params });
  console.log("response.data", response.data);
  return response.data;
};

// Date range records endpoint
export const getRecordsByDateRange = async (
  params: RecordsDateRangeParams
): Promise<RecordsDateRangeResponse> => {
  const apiInstance = api({});
  const response = await apiInstance.get("/records/date-range", { params });
  return response.data;
};

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
  metadata: Omit<Record, "playHistoryUrl"> | null;
  setMetadata: (metadata: Omit<Record, "playHistoryUrl"> | null) => void;
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
  const [metadata, setMetadata] = useState<Omit<Record, "playHistoryUrl"> | null>(
    null
  );
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
        metadata,
        setMetadata,
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
