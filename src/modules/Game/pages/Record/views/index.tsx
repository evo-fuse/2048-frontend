import { Record, useRecordContext } from "../../../../../context";
import { useDragAndDrop } from "../../../../../hooks";
import GameBoard from "../../Main/components/GameBoard";
import { GRID_SIZE, SPACING } from "../../Main/utils/constants";
import { ThemeProvider } from "styled-components";
import { defaultPalette } from "../../Main/themes/default";
import useGameBoardForReplay from "../../Main/hooks/useGameBoardForReplay";
import { IoCaretBack } from "react-icons/io5";
import { IoCaretForward } from "react-icons/io5";
import { IoPlay, IoPause, IoStop } from "react-icons/io5";
import { IoTime } from "react-icons/io5";
import { Select } from "../../../../../components/Select";
import { OnlineReplayExploreModal } from "../components/OnlineReplayExploreModal";
import { useEffect, useState, useRef, useCallback } from "react";
import { TbFileSearch, TbWorld } from "react-icons/tb";
import { SlCamrecorder } from "react-icons/sl";
import { IoIosMove } from "react-icons/io";
import { BsSpeedometer2 } from "react-icons/bs";

export const RecordView: React.FC = () => {
  const { replay, setReplay, setMetadata, metadata } = useRecordContext();

  // Speed options for the Select component
  const speedOptions = [
    { value: 0.5, label: "0.5x" },
    { value: 1, label: "1x" },
    { value: 2, label: "2x" },
    { value: 4, label: "4x" },
  ];

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData: any = JSON.parse(content);
        console.log("Parsed JSON data:", parsedData);

        // Check if the parsed data has the expected structure
        if (!parsedData.playHistory || !Array.isArray(parsedData.playHistory)) {
          throw new Error(
            "Invalid file format. Expected JSON with 'activity' array property."
          );
        }

        console.log("Valid activity data:", parsedData.playHistory);
        setReplay([...parsedData.playHistory]);
        setMetadata({
          user: { ...parsedData.user },
          rows: parsedData.rows,
          cols: parsedData.cols,
          score: parsedData.score,
          move: parsedData.move,
          playTime: parsedData.playTime,
          date: parsedData.date,
        });
      } catch (err) {
        console.error("JSON parsing error:", err);
        throw new Error(
          "Invalid JSON file. Please upload a valid activity track file."
        );
      }
    };
    reader.onerror = () => {
      throw new Error("Error reading file");
    };
    reader.readAsText(file);
  };

  const { isDragOver, error, fileName, dragHandlers, fileInputHandlers } =
    useDragAndDrop({
      onFileProcess: processFile,
      acceptedFileTypes: [".json"],
    });

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { tiles, onMovePending, onMergePending, breakTile, doubleTile } =
    useGameBoardForReplay({
      rows: 4,
      cols: 4,
      gameState: {
        status: "running",
        pause: false,
      },
      addScore: () => { },
      replay,
      index,
    });

  // Calculate the next index based on current time and timestamps
  const getNextIndex = useCallback(
    (currentTime: number) => {
      if (replay.length === 0) return 0;

      const startTimestamp = replay[0].timestamp;
      const elapsedTime = (currentTime - startTimeRef.current) * playbackSpeed;

      for (let i = 0; i < replay.length; i++) {
        const activityTime = replay[i].timestamp - startTimestamp;
        if (elapsedTime >= activityTime) {
          continue;
        }
        return Math.max(0, i - 1);
      }

      return replay.length - 1;
    },
    [replay, playbackSpeed]
  );

  // Start playback simulation
  const startPlayback = useCallback(() => {
    if (replay.length === 0) return;

    setIsPlaying(true);
    startTimeRef.current =
      Date.now() - (currentTimeRef.current * 1000) / playbackSpeed;

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const nextIndex = getNextIndex(currentTime);

      if (nextIndex !== index) {
        setIndex(nextIndex);
      }

      // Stop when reaching the end
      if (nextIndex >= replay.length - 1) {
        stopPlayback();
      }
    }, 16); // ~60fps
  }, [replay, index, getNextIndex, playbackSpeed]);

  // Stop playback simulation
  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Pause playback simulation
  const pausePlayback = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    currentTimeRef.current =
      ((Date.now() - startTimeRef.current) * playbackSpeed) / 1000;
  }, [playbackSpeed]);

  // Reset playback to beginning
  const resetPlayback = useCallback(() => {
    stopPlayback();
    setIndex(0);
    currentTimeRef.current = 0;
    startTimeRef.current = 0;
  }, [stopPlayback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Reset when replay data changes
  useEffect(() => {
    resetPlayback();
  }, [replay, resetPlayback]);

  // Handle record selection from modal
  const handleRecordSelect = async (record: Record) => {
    const { playHistoryUrl, ...data } = record;
    setMetadata({ ...data });

    // Fetch and load the replay data from the S3 bucket URL
    if (playHistoryUrl) {
      try {
        const response = await fetch(playHistoryUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch replay data");
        }
        const data = await response.json();

        if (data && Array.isArray(data)) {
          setReplay([...data]);
        } else {
          console.error("Invalid replay data format");
        }
      } catch (error) {
        console.error("Error loading replay data:", error);
      } finally {
        setIsModalOpen(false);
      }
    }
  };

  return (
    <ThemeProvider theme={{ borderradius: "14px", palette: defaultPalette }}>
      <div className="w-full h-full flex flex-col items-center justify-center overflow-y-auto">
        {/* Header Section */}
        <div className="w-full max-w-4xl mb-2 flex items-center justify-center gap-4">
          <SlCamrecorder className="text-cyan-400" size={32} />
          <h2 className="text-4xl font-bold mb-2 text-center text-cyan-400">
            Game Replay
          </h2>
        </div>

        {/* Upload Section - Inline */}
        <div className="w-full max-w-4xl mb-2 flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-nowrap text-white p-[14px] border-2 rounded-lg border-cyan-600 text-sm min-h-max hover:border-cyan-400 hover:bg-cyan-800/30 transition-colors"
          >
            <TbWorld className="text-cyan-400" size={20} />
            Online Replay
          </button>
          <div
            className={`w-full flex items-center justify-between p-3 border-2 border-dashed rounded-lg transition-all duration-300 ${isDragOver
              ? "border-cyan-400 bg-cyan-800/50 shadow-lg shadow-cyan-500/20"
              : "border-cyan-600 hover:border-cyan-400 bg-gray-900/30 hover:bg-cyan-800/40"
              }`}
            {...dragHandlers}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-white font-medium">
                {isDragOver
                  ? "Drop JSON file here"
                  : fileName
                    ? `Selected: ${fileName}`
                    : "Choose JSON file or drag & drop"}
              </span>
            </div>
            <div className="">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-cyan-700 hover:bg-cyan-600 text-white py-1.5 px-3 rounded text-sm transition-all duration-200 font-medium cursor-none"
              >
                <TbFileSearch className="text-white" size={18} />
                Browse
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                {...fileInputHandlers}
              />
            </div>
          </div>

          {error && (
            <div className="mt-2 p-2 bg-red-900/30 border border-red-600 rounded text-xs">
              <div className="text-red-300">{error}</div>
            </div>
          )}
        </div>

        {/* Playback Controls - Above Game Board */}
        {replay.length > 0 && (
          <div className="w-full max-w-4xl mb-2">
            <div className="bg-gray-900/50 p-3 rounded-lg border border-cyan-700 shadow-lg shadow-cyan-900/30">
              <div className="flex items-center justify-between gap-4">
                {/* Seek State Display */}
                <div className="flex items-center gap-2">
                  <IoIosMove className="text-white" size={20} />
                  <span className="text-white text-sm font-medium">Move:</span>
                  <span className="text-gray-300 text-sm">
                    {index + 1} / {replay.length}
                  </span>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center gap-2">
                  {/* Speed Control */}
                  <div className="flex items-center gap-1">
                    <BsSpeedometer2 className="text-white" size={20} />
                    <span className="text-white text-xs">Speed:</span>
                    <Select
                      options={speedOptions}
                      value={playbackSpeed}
                      onChange={(value) => setPlaybackSpeed(Number(value))}
                      disabled={isPlaying}
                      className="min-w-16"
                    />
                  </div>

                  {/* Main Controls */}
                  <div className="flex items-center gap-1">
                    {!isPlaying ? (
                      <button
                        onClick={startPlayback}
                        className="p-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-cyan-500/30"
                        title="Play"
                      >
                        <IoPlay size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={pausePlayback}
                        className="p-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-cyan-500/30"
                        title="Pause"
                      >
                        <IoPause size={16} />
                      </button>
                    )}

                    <button
                      onClick={resetPlayback}
                      className="p-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-cyan-500/30"
                      title="Stop"
                    >
                      <IoStop size={16} />
                    </button>
                  </div>

                  {/* Manual Navigation */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        stopPlayback();
                        setIndex(index - 1 < 0 ? 0 : index - 1);
                      }}
                      className="p-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-cyan-500/30"
                      title="Previous"
                    >
                      <IoCaretBack size={16} />
                    </button>
                    <button
                      onClick={() => {
                        stopPlayback();
                        setIndex(
                          index + 1 > replay.length - 1
                            ? replay.length - 1
                            : index + 1
                        );
                      }}
                      className="p-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-cyan-500/30"
                      title="Next"
                    >
                      <IoCaretForward size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Three Column Layout: Record List | Game Board | Metadata */}
        <div className="w-full max-w-4xl flex gap-3 mb-4">
          {/* Center - Game Board */}
          <div className="flex-1 flex justify-between min-w-0">
            <div className="bg-gray-900/50 p-2 rounded-lg border border-cyan-700 shadow-lg shadow-cyan-900/30 max-w-max">
              <GameBoard
                tiles={tiles}
                boardSize={GRID_SIZE}
                rows={metadata?.rows || 4}
                cols={metadata?.cols || 4}
                spacing={SPACING}
                onMove={() => { }}
                onMovePending={onMovePending}
                onMergePending={onMergePending}
                breakTile={breakTile}
                doubleTile={doubleTile}
                showFireworks={false}
              />
            </div>
          </div>

          <div className="w-64">
            <div className="bg-gray-900/50 p-3 rounded-lg border border-cyan-700 shadow-lg shadow-cyan-900/30">
              <h3 className="text-white text-base font-bold mb-2 flex items-center gap-2">
                <IoTime className="text-cyan-400" size={16} />
                Game Metadata
              </h3>
              <div className="space-y-2">
                <div className="bg-cyan-900/20 p-2 rounded-lg border border-cyan-600/50">
                  <div className="text-xs text-cyan-300 mb-1">Player</div>
                  <div className="text-white text-xs font-medium truncate">
                    {metadata?.user.address}
                  </div>
                </div>
                <div className="bg-cyan-900/20 p-2 rounded-lg border border-cyan-600/50">
                  <div className="text-xs text-cyan-300 mb-1">Score</div>
                  <div className="text-white text-xs font-medium">
                    {metadata?.score.toLocaleString()}
                  </div>
                </div>
                <div className="bg-cyan-900/20 p-2 rounded-lg border border-cyan-600/50">
                  <div className="text-xs text-cyan-300 mb-1">Moves</div>
                  <div className="text-white text-xs font-medium">
                    {metadata?.move}
                  </div>
                </div>
                <div className="bg-cyan-900/20 p-2 rounded-lg border border-cyan-600/50">
                  <div className="text-xs text-cyan-300 mb-1">Duration</div>
                  <div className="text-white text-xs font-medium">
                    {metadata?.playTime}
                  </div>
                </div>
                <div className="bg-cyan-900/20 p-2 rounded-lg border border-cyan-600/50">
                  <div className="text-xs text-cyan-300 mb-1">Date</div>
                  <div className="text-white text-xs font-medium">
                    {metadata?.date}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Online Replay Explore Modal */}
        <OnlineReplayExploreModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectRecord={handleRecordSelect}
        />
      </div>
    </ThemeProvider>
  );
};
