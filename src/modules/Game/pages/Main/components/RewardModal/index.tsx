import Modal from "../../../../../../components/Modal";
import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../../../../../../context/AuthContext";
import { useWeb3Context } from "../../../../../../context/Web3Context";
import { Toast } from "../../../../../../components";
import { FaSpinner } from "react-icons/fa";
import { GameStatus } from "../../hooks/useGameState";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxTile: number;
  total: number;
  pendingFunction: Function;
  status?: GameStatus;
}

const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  onClose,
  maxTile,
  total,
  pendingFunction,
  status,
}) => {
  const { user, handleRequestRewarding } = useAuthContext();
  const [animate, setAnimate] = useState(false);
  const estimatedReward: number = 
    maxTile >= 2048 ? Math.floor(total / 100 + maxTile / 10) : 0;

  const hasReward: boolean = useMemo(() => maxTile >= 2048, [maxTile]);

  const { getBalance } = useWeb3Context();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isOpen) {
      // Trigger animation after modal opens
      const timer = setTimeout(() => setAnimate(true), 300);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (status === "lost") {
          pendingFunction();
        }
        onClose();
      }}
      title={status === "lost" ? "Game Over" : "Game Rewards"}
      closeOnOutsideClick={!loading && status !== "lost"}
    >
      <div className="w-full p-6 rounded-lg flex flex-col items-center">
        <div
          className={`flex flex-col items-center gap-5 w-full transition-all duration-500 ${
            animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Trophy icon - only show when there's a reward */}
          {hasReward && <div className="text-yellow-300 text-5xl mb-2">🏆</div>}

          {/* Congratulations - only show when there's a reward */}
          {hasReward && (
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Congratulations!
            </h2>
          )}

          {/* Game stats - always show */}
          <div className="w-full space-y-4">
            <div className="text-lg text-white flex justify-between w-full p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="font-semibold">Highest Tile:</span>
              <span className="font-bold text-white">{maxTile}</span>
            </div>

            <div className="text-lg text-white flex justify-between w-full p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="font-semibold">Final Score:</span>
              <span className="font-bold text-white">{total}</span>
            </div>
          </div>

          {/* Reward section */}
          <div
            className={`mt-4 p-5 bg-gray-700/60 backdrop-blur-md border border-white/20 rounded-lg shadow-lg transform transition-all duration-700 ${
              animate ? "scale-100 rotate-0" : "scale-90 rotate-3"
            } w-full`}
          >
            <div className="flex flex-col items-center justify-center gap-2 text-white text-center">
              <div className="text-xl">Estimated Reward:</div>
              <div className="text-3xl font-bold flex items-center">
                <span
                  className={`transition-all duration-1000 ${
                    animate ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {estimatedReward}
                </span>
                <span className="ml-2 text-white">DWAT</span>
              </div>

              {/* Message when no reward */}
              {!hasReward && (
                <div className="text-gray-300 mt-2 text-sm">
                  Reach a tile of 2048 or higher to earn rewards!
                </div>
              )}

              {/* Coin animation - only show when there's a reward */}
              {hasReward && (
                <div className="flex mt-2 space-x-1">
                  {[...Array(Math.min(5, estimatedReward))].map((_, i) => (
                    <div
                      key={i}
                      className={`text-yellow-300 text-xl transition-all duration-500 delay-${
                        i * 100
                      } ${
                        animate
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                    >
                      💰
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => {
                if (status === "lost") {
                  pendingFunction();
                }
                onClose();
              }}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-md hover:bg-white/20 transition-colors border border-white/10"
            >
              Close
            </button>

            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  if (estimatedReward === 0 || !user?.address) {
                    Toast.error("No reward to request");
                    return;
                  }
                  const { data } = await handleRequestRewarding(
                    user?.address || "",
                    estimatedReward
                  );
                  if (data.success) {
                    await getBalance();
                  }
                } catch (error) {
                  Toast.error("Error requesting reward");
                } finally {
                  setLoading(false);
                  pendingFunction();
                  onClose();
                }
              }}
              className="px-6 py-3 w-32 flex items-center justify-center bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all shadow-lg border border-white/10 font-medium"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : hasReward ? (
                "Receive Reward"
              ) : (
                "New Game"
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RewardModal;
