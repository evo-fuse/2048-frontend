export interface ThemeAnalysis {
    themeTopic: string;
    maxTile: number;
    themeStyle: string;
    description: string;
}

export interface TilePrompt {
    value: number;
    prompt: string;
    title: string;
    description: string;
}

export type Step = "input" | "analysis" | "prompts" | "themeDetails" | "generating" | "complete";

export interface ThemeDetails {
    visibility: "private" | "public" | "premium";
    price?: number;
    numberDisplay: {
        show: boolean;
        position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
        color: string;
        size: number;
    };
}

export interface StepConfig {
    key: Step;
    label: string;
}

