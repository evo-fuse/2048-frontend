import Modal from "../../../../../../components/Modal";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuthContext } from "../../../../../../context/AuthContext";
import { useWeb3Context } from "../../../../../../context/Web3Context";
import { Toast } from "../../../../../../components";
import { FaSpinner, FaTimes, FaRedo } from "react-icons/fa";
import { GameStatus } from "../../hooks/useGameState";
import { useGameContext } from "../../../../context/GameContext";

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
  total = 0,
  pendingFunction,
  status,
}) => {
  const { user, handleRequestRewarding, handleUpdateUser } = useAuthContext();
  const { setItemUsage, setFireworksState } = useGameContext();
  const [animate, setAnimate] = useState(false);
  const click = useRef<boolean>(false);
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

  const handleNewGame = async () => {
    if (click.current === true || loading) return;
    click.current = true;
    try {
      setLoading(true);
      if (estimatedReward > 0 && user?.address) {
        await handleRequestRewarding(user?.address, estimatedReward);
        await handleUpdateUser({
          maxTile: Math.max(maxTile, user.maxTile),
          maxScore: Math.max(total, user.maxScore),
        });
        await getBalance();
      }
    } catch (error) {
      Toast.error("Error requesting reward");
    } finally {
      setLoading(false);
      setFireworksState(false);
      pendingFunction();
      onClose();
      setItemUsage({ powerup: false, upgrade: false });
      // Set a small delay before allowing clicks again
      setTimeout(() => {
        click.current = false;
      }, 500);
    }
  };

  const handleClose = () => {
    if (status === "lost") {
      pendingFunction();
    }

    // Always execute these actions when closing
    setFireworksState(false);
    setItemUsage({ powerup: false, upgrade: false });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={status === "lost" ? "Game Over" : "Game Rewards"}
      closeOnOutsideClick={!loading && status !== "lost"}
    >
      <div className="w-full p-6 rounded-lg flex flex-col items-center">
        <div
          className={`flex flex-col items-center gap-5 w-full transition-all duration-500 ${animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
        >
          {/* Trophy icon - only show when there's a reward */}
          {hasReward && <div className="text-cyan-400 text-5xl mb-2">🏆</div>}

          {/* Congratulations - only show when there's a reward */}
          {hasReward && (
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Congratulations!
            </h2>
          )}

          {/* Game stats - always show */}
          <div className="w-full space-y-4">
            <div className="text-lg text-white flex justify-between w-full p-3 bg-cyan-900/20 rounded-lg border border-cyan-400/20">
              <span className="font-semibold">Highest Tile:</span>
              <span className="font-bold text-cyan-300">{maxTile}</span>
            </div>

            <div className="text-lg text-white flex justify-between w-full p-3 bg-cyan-900/20 rounded-lg border border-cyan-400/20">
              <span className="font-semibold">Final Score:</span>
              <span className="font-bold text-cyan-300">{total}</span>
            </div>
          </div>

          {/* Reward section */}
          <div
            className={`mt-4 p-5 bg-cyan-900/40 backdrop-blur-md border border-cyan-400/30 rounded-lg shadow-lg shadow-cyan-500/20 transform transition-all duration-700 ${animate ? "scale-100 rotate-0" : "scale-90 rotate-3"
              } w-full`}
          >
            <div className="flex flex-col items-center justify-center gap-2 text-white text-center">
              <div className="text-xl">Estimated Reward:</div>
              <div className="text-3xl font-bold flex items-center">
                <span
                  className={`text-cyan-300 transition-all duration-1000 ${animate ? "opacity-100" : "opacity-0"
                    }`}
                >
                  {estimatedReward}
                </span>
                <span className="ml-2 text-cyan-200">DWAT</span>
              </div>

              {/* Message when no reward */}
              {!hasReward && (
                <div className="text-cyan-300 mt-2 text-sm">
                  Reach a tile of 2048 or higher to earn rewards!
                </div>
              )}

              {/* Coin animation - only show when there's a reward */}
              {hasReward && (
                <div className="flex mt-2 space-x-1">
                  {[...Array(Math.min(5, estimatedReward))].map((_, i) => (
                    <div
                      key={i}
                      className={`text-cyan-400 text-xl transition-all duration-500 delay-${i * 100
                        } ${animate
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
              onClick={handleClose}
              className="px-6 py-3 bg-cyan-900/20 backdrop-blur-sm text-white rounded-md hover:bg-cyan-800/30 transition-colors border border-cyan-400/20 flex items-center justify-center gap-2"
            >
              <FaTimes />
              Close
            </button>

            <button
              onClick={handleNewGame}
              disabled={loading || click.current}
              className={`px-6 py-3 flex items-center justify-center gap-2 ${loading || click.current
                ? "bg-cyan-700/50 cursor-not-allowed opacity-70"
                : "bg-cyan-600 hover:bg-cyan-500"
                } text-white text-nowrap rounded-md transition-all shadow-lg shadow-cyan-500/30 border border-cyan-400/30 font-medium`}
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  <FaRedo />
                  {hasReward ? "Receive Reward" : "New Game"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RewardModal;
