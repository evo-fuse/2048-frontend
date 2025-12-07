import { useState, useCallback } from "react";
import { api } from "../../../../../utils/api";
import { ThemeAnalysis, TilePrompt, Step, ThemeDetails } from "../types";

export const useAITheme = () => {
    const [step, setStep] = useState<Step>("input");
    const [prompt, setPrompt] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
    const [isGeneratingImages, setIsGeneratingImages] = useState(false);
    const [analysis, setAnalysis] = useState<ThemeAnalysis | null>(null);
    const [tilePrompts, setTilePrompts] = useState<TilePrompt[]>([]);
    const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
    const [themeDetails, setThemeDetails] = useState<ThemeDetails>({
        visibility: "private",
        numberDisplay: {
            show: true,
            position: "center",
            color: "#ffffff",
            size: 16,
        },
    });
    const [error, setError] = useState<string | null>(null);
    const [currentGeneratingTile, setCurrentGeneratingTile] = useState<number | null>(null);

    const handleAnalyze = useCallback(async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt");
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            const response = await api({}).post("/openai/analyze-theme", { prompt });
            setAnalysis(response.data);
            setStep("analysis");
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to analyze prompt");
        } finally {
            setIsAnalyzing(false);
        }
    }, [prompt]);

    const handleConfirmAnalysis = useCallback(async (editedAnalysis?: ThemeAnalysis) => {
        const analysisToUse = editedAnalysis || analysis;
        if (!analysisToUse) return;

        setIsGeneratingPrompts(true);
        setError(null);

        try {
            const promptsResponse = await api({}).post("/openai/generate-tile-prompts", {
                themeTopic: analysisToUse.themeTopic,
                maxTile: analysisToUse.maxTile,
                themeStyle: analysisToUse.themeStyle,
                description: analysisToUse.description,
            });

            const tiles: TilePrompt[] = promptsResponse.data.tiles;
            setTilePrompts(tiles);
            setStep("prompts");
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to generate prompts");
        } finally {
            setIsGeneratingPrompts(false);
        }
    }, [analysis]);

    const handleUpdatePrompt = useCallback((value: number, field: keyof TilePrompt, newValue: string) => {
        setTilePrompts((prev) =>
            prev.map((tile) =>
                tile.value === value ? { ...tile, [field]: newValue } : tile
            )
        );
    }, []);

    const handleGenerateImages = useCallback(async () => {
        if (tilePrompts.length === 0) return;

        setIsGeneratingImages(true);
        setStep("generating");
        setError(null);

        try {
            const images: Record<number, string> = {};

            for (const tile of tilePrompts) {
                setCurrentGeneratingTile(tile.value);

                try {
                    const imageResponse = await api({}).post("/runware/text-to-image", {
                        positivePrompt: tile.prompt,
                        negativePrompt: "blurry, low quality, distorted",
                        model: "google:4@1",
                        numImages: 1,
                        width: 512,
                        height: 512,
                    });

                    if (imageResponse.data && imageResponse.data.length > 0) {
                        images[tile.value] = imageResponse.data[0];
                        setGeneratedImages((prev) => ({ ...prev, [tile.value]: imageResponse.data[0] }));
                    }
                } catch (err) {
                    console.error(`Failed to generate image for tile ${tile.value}:`, err);
                }
            }

            setGeneratedImages((prev) => ({ ...prev, ...images }));
            setStep("themeDetails");
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to generate images");
            setStep("prompts");
        } finally {
            setIsGeneratingImages(false);
            setCurrentGeneratingTile(null);
        }
    }, [tilePrompts]);

    const handleUpdateThemeDetails = useCallback((details: ThemeDetails) => {
        setThemeDetails(details);
    }, []);

    const handleConfirmThemeDetails = useCallback(() => {
        // Navigate to complete step after theme details are confirmed
        setStep("complete");
    }, []);

    const handleReset = useCallback(() => {
        setStep("input");
        setPrompt("");
        setAnalysis(null);
        setTilePrompts([]);
        setGeneratedImages({});
        setThemeDetails({
            visibility: "private",
            numberDisplay: {
                show: true,
                position: "center",
                color: "#ffffff",
                size: 16,
            },
        });
        setError(null);
        setCurrentGeneratingTile(null);
    }, []);

    const getTileValues = useCallback(() => {
        if (!analysis) return [];
        const values: number[] = [];
        for (let value = 2; value <= analysis.maxTile; value *= 2) {
            values.push(value);
        }
        return values;
    }, [analysis]);

    const handleRegenerateSingleTile = useCallback(async (tileValue: number) => {
        const tile = tilePrompts.find((t) => t.value === tileValue);
        if (!tile) return;

        setCurrentGeneratingTile(tileValue);
        setError(null);

        try {
            const imageResponse = await api({}).post("/runware/text-to-image", {
                positivePrompt: tile.prompt,
                negativePrompt: "blurry, low quality, distorted",
                model: "google:4@1",
                numImages: 1,
                width: 512,
                height: 512,
            });

            if (imageResponse.data && imageResponse.data.length > 0) {
                setGeneratedImages((prev) => ({ ...prev, [tileValue]: imageResponse.data[0] }));
            }
        } catch (err: any) {
            setError(err.response?.data?.error || `Failed to regenerate image for tile ${tileValue}`);
        } finally {
            setCurrentGeneratingTile(null);
        }
    }, [tilePrompts]);

    return {
        // State
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
        // Actions
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
        setError,
    };
};
