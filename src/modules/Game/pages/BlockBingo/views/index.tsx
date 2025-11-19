import { useState } from "react";
import { useAuthContext } from "../../../../../context";
import { GameStats, GameGrid, GameControls, HelpModal, ErrorModal } from "../components";
import { useGameLogic } from "../hooks/useGameLogic";
import { Images } from "../../../../../assets/images";

export const BlockBingoView = () => {
    const { user } = useAuthContext();
    // Preserve network and currency selections (don't reset on component remount)
    const [network, setNetwork] = useState<string>(() => {
        return localStorage.getItem('blockbingo_network') || "Fuse";
    });
    const [currency, setCurrency] = useState<string>(() => {
        return localStorage.getItem('blockbingo_currency') || "USDT";
    });
    const [depositAmount, setDepositAmount] = useState<string>("1");
    const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

    const {
        gameState,
        grid,
        columnTileSequences,
        columnPaused,
        scrollPositions,
        attemptsLeft,
        totalScore,
        lastScore,
        matchingTiles,
        currentBalance,
        rewardAmount,
        handleColumnClick,
        handleStartGame,
        handleRestart,
        calculateReward,
        getUserBalanceKey,
        errorModal,
        closeErrorModal
    } = useGameLogic(user, network, currency, depositAmount);

    // Save network and currency to localStorage when they change
    const handleNetworkChange = (value: string) => {
        setNetwork(value);
        localStorage.setItem('blockbingo_network', value);
    };

    const handleCurrencyChange = (value: string) => {
        setCurrency(value);
        localStorage.setItem('blockbingo_currency', value);
    };

    return (
        <>
            <div className="w-full h-full text-white flex gap-6">
                {/* Main Game Area */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex w-full relative items-center justify-between border-b border-white/10">
                        <div className="flex items-center gap-6 pl-8">
                            <img src={Images.BLOCKBINGO} alt="BlockBingo" className="w-16 h-16 object-cover" />
                            <h2 className="3xs:text-base sm:text-2xl font-bold py-6">
                                Block Bingo
                            </h2>
                        </div>
                    </div>

                    {/* Game Stats */}
                    <GameStats
                        attemptsLeft={attemptsLeft}
                        totalScore={totalScore}
                        lastScore={lastScore}
                    />

                    {/* Game Grid */}
                    <GameGrid
                        columnPaused={columnPaused}
                        scrollPositions={scrollPositions}
                        columnTileSequences={columnTileSequences}
                        grid={grid}
                        matchingTiles={matchingTiles}
                        gameState={gameState}
                        onColumnClick={handleColumnClick}
                    />
                </div>

                {/* Sidebar - Controls & Info */}
                <GameControls
                    gameState={gameState}
                    network={network}
                    currency={currency}
                    depositAmount={depositAmount}
                    user={user}
                    totalScore={totalScore}
                    currentBalance={currentBalance}
                    rewardAmount={rewardAmount}
                    onNetworkChange={handleNetworkChange}
                    onCurrencyChange={handleCurrencyChange}
                    onDepositAmountChange={setDepositAmount}
                    onStartGame={handleStartGame}
                    onRestart={handleRestart}
                    onOpenHelp={() => setIsHelpModalOpen(true)}
                    calculateReward={calculateReward}
                    getUserBalanceKey={getUserBalanceKey}
                />
            </div>

            {/* Help Modal */}
            <HelpModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
            />
            <ErrorModal
                isOpen={Boolean(errorModal)}
                title={errorModal?.title}
                message={errorModal?.message || ""}
                onClose={closeErrorModal}
            />
        </>
    );
};
