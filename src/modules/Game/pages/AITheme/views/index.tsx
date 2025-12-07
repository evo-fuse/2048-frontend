import { AnimatePresence } from "framer-motion";
import { PiMagicWand } from "react-icons/pi";
import { useAITheme } from "../hooks/useAITheme";
import {
    ErrorMessage,
    ProgressSteps,
    InputStep,
    AnalysisStep,
    PromptsStep,
    ThemeDetailsStep,
    GeneratingStep,
    CompleteStep,
} from "../components";
import { GrMoney } from "react-icons/gr";
import { useAuthContext } from "../../../../../context";
import { ChargeCreditModal } from "../components";
import { useOpen } from "../../../../../hooks";

export const AIThemeView = () => {
    const {
        step,
        prompt,
        isAnalyzing,
        isGeneratingPrompts,
        isGeneratingImages,
        analysis,
        tilePrompts,
        generatedImages,
        themeDetails,
        error,
        currentGeneratingTile,
        setStep,
        setPrompt,
        handleAnalyze,
        handleConfirmAnalysis,
        handleUpdatePrompt,
        handleUpdateThemeDetails,
        handleConfirmThemeDetails,
        handleGenerateImages,
        handleRegenerateSingleTile,
        handleReset,
        getTileValues,
    } = useAITheme();
    const { user } = useAuthContext();
    const { isOpen, onOpen, onClose } = useOpen();

    const handleChargeCredit = () => {
        onOpen();
    };

    const handleSave = async (onProgress: (status: { status: string; progress?: number; message: string }) => void) => {
        if (!analysis) {
            onProgress({
                status: 'error',
                message: 'Theme analysis data is missing'
            });
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/themes/ai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    title: analysis.themeTopic,
                    description: analysis.description,
                    visibility: themeDetails.visibility,
                    price: themeDetails.price,
                    numberDisplay: themeDetails.numberDisplay,
                    tilePrompts: tilePrompts,
                    generatedImages: generatedImages,
                }),
            });

            const reader = response.body?.getReader();
            if (!reader) throw new Error('Failed to get response reader');

            const decoder = new TextDecoder();
            let theme = null;

            // Process the stream of events
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.substring(6));
                            onProgress(data);

                            if (data.status === 'complete') {
                                theme = data.theme;
                            }
                        } catch (e) {
                            console.error('Error parsing SSE data:', e);
                        }
                    }
                }
            }

            return theme;
        } catch (error) {
            console.error("Error saving theme:", error);
            onProgress({
                status: 'error',
                message: error instanceof Error ? error.message : 'Failed to save theme'
            });
            throw error;
        }
    };

    return (
        <div className="w-full h-full text-white flex flex-col items-center justify-start p-8">
            <div className="max-w-4xl w-full flex flex-col h-full">
                {/* Fixed Header */}
                <div className="flex-shrink-0">
                    <div className="flex items-center justify-between gap-3 mb-8 border-b border-cyan-700 pb-4">
                        <div className="flex items-center gap-3">
                            <PiMagicWand className="text-4xl text-cyan-400" />
                            <h1 className="text-4xl font-bold text-cyan-400">AI Theme Generator</h1>
                        </div>
                        <div
                            onClick={handleChargeCredit}
                            className="flex items-center gap-4 px-4 py-2 text-sm text-cyan-400 rounded-full bg-cyan-800/50 border border-cyan-700 hover:bg-cyan-800/70 transition-all"
                        >
                            <GrMoney /> <span className="font-bold text-white">{user?.ATCredits}</span>
                        </div>
                    </div>
                    <ProgressSteps currentStep={step} />

                    <AnimatePresence>
                        <ErrorMessage error={error} />
                    </AnimatePresence>
                </div>
                <ChargeCreditModal isOpen={isOpen} onClose={onClose} />

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    <AnimatePresence mode="wait">
                        {step === "input" && (
                            <InputStep
                                prompt={prompt}
                                onPromptChange={setPrompt}
                                onAnalyze={handleAnalyze}
                                isAnalyzing={isAnalyzing}
                            />
                        )}

                        {step === "analysis" && analysis && (
                            <AnalysisStep
                                analysis={analysis}
                                onBack={() => setStep("input")}
                                onConfirm={(editedAnalysis) => handleConfirmAnalysis(editedAnalysis)}
                                isGeneratingPrompts={isGeneratingPrompts}
                            />
                        )}

                        {step === "prompts" && tilePrompts.length > 0 && (
                            <PromptsStep
                                tilePrompts={tilePrompts}
                                onBack={() => setStep("analysis")}
                                onGenerateImages={handleGenerateImages}
                                onUpdatePrompt={handleUpdatePrompt}
                                isGeneratingImages={isGeneratingImages}
                            />
                        )}

                        {step === "generating" && (
                            <GeneratingStep
                                tilePrompts={tilePrompts}
                                generatedImages={generatedImages}
                                currentGeneratingTile={currentGeneratingTile}
                                getTileValues={getTileValues}
                            />
                        )}

                        {step === "themeDetails" && (
                            <ThemeDetailsStep
                                themeDetails={themeDetails}
                                generatedImages={generatedImages}
                                tilePrompts={tilePrompts}
                                getTileValues={getTileValues}
                                onBack={() => setStep("generating")}
                                onNext={handleConfirmThemeDetails}
                                onUpdateDetails={handleUpdateThemeDetails}
                                onUpdatePrompt={handleUpdatePrompt}
                                onRegenerateTile={handleRegenerateSingleTile}
                                isRegenerating={currentGeneratingTile !== null}
                            />
                        )}

                        {step === "complete" && (
                            <CompleteStep
                                tilePrompts={tilePrompts}
                                generatedImages={generatedImages}
                                themeDetails={themeDetails}
                                onBack={() => setStep("themeDetails")}
                                onReset={handleReset}
                                onSave={handleSave}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
