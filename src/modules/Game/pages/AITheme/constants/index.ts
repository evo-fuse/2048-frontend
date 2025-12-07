import { StepConfig, Step } from "../types";

export const STEPS: StepConfig[] = [
    { key: "input", label: "Prompt" },
    { key: "analysis", label: "Review" },
    { key: "prompts", label: "Edit" },
    { key: "generating", label: "Generate" },
    { key: "themeDetails", label: "Settings" },
    { key: "complete", label: "Complete" },
];

export const STEP_KEYS: Step[] = ["input", "analysis", "prompts", "generating", "themeDetails", "complete"];

