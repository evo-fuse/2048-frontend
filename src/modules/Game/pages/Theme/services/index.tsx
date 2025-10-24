import api from "../../../../../utils/api";

interface TextToImageParams {
    positivePrompt: string,
    negativePrompt?: string,
    model?: string,
    numImages?: number,
    width?: number,
    height?: number,
    steps?: number,
    CFGScale?: number,
}
export const getThemeInfo = async (userPrompt: string, imageStyle: "cinematic" | "creative" | "dynamic" | "fashion" = "cinematic") => {
    const styleInstructions = {
        cinematic: "Use cinematic lighting, dramatic shadows, and film-like composition. Focus on depth, atmosphere, and professional photography aesthetics.",
        creative: "Use artistic and imaginative visual elements, creative compositions, and unique artistic interpretations. Focus on creativity and artistic expression.",
        dynamic: "Use energetic, vibrant, and action-oriented visual elements. Focus on movement, energy, and dynamic compositions.",
        fashion: "Use elegant, sophisticated, and stylish visual elements. Focus on aesthetics, elegance, and contemporary design trends."
    };

    const system = `
    The user will provide you with a theme for creating a 2048 tile theme.
    You must submit a description and image creation prompt for tiles ranging from 2 to at least 8192, based on the theme provided by the user.
    
    IMAGE STYLE REQUIREMENT: ${styleInstructions[imageStyle]}
    
    CRITICAL REQUIREMENTS FOR VISUAL CONSISTENCY:
    1. ALL TILES MUST USE THE EXACT SAME ART STYLE - specify one consistent style (e.g., "flat design", "minimalist illustration", "geometric", "watercolor", "digital art")
    2. ALL TILES MUST HAVE THE SAME COMPOSITION STYLE - specify layout approach (e.g., "centered", "geometric grid", "floating elements")
    3. ONLY THE CONTENT/SUBJECT MATTER CHANGES - the visual style, colors, and composition must remain identical
    4. Each prompt should be 1-2 sentences maximum
    5. Focus on clean, minimalist design suitable for game tiles
    6. Apply the specified image style (${imageStyle}) consistently across all tiles
    
    MANDATORY PROMPT STRUCTURE (follow exactly):
    - Start with: "[Main visual element] in [EXACT SAME STYLE] style"
    - Add: "using [EXACT SAME COLOR PALETTE] colors"
    - Include: "with [EXACT SAME COMPOSITION] layout"
    - End with: "high quality, detailed, sharp, consistent style"
    
    The submission format must be JSON, as follows:
    {
        title: String,
        description: String,
        2: {description: String, prompt: String},
        4: {description: String, prompt: String},
        8: {description: String, prompt: String},
        16: {description: String, prompt: String},
        32: {description: String, prompt: String},
        64: {description: String, prompt: String},
        128: {description: String, prompt: String},
        256: {description: String, prompt: String},
        512: {description: String, prompt: String},
        1024: {description: String, prompt: String},
        2048: {description: String, prompt: String},
        4096: {description: String, prompt: String},
        8192: {description: String, prompt: String},
    }
    `;
    const { status, data } = await api({}).post("/openai", { system, user: userPrompt });
    const parseData = JSON.parse(data.startsWith("{") ? data : data.substring(7, data.length - 3)) || {}
    return { status, parseData };
}

export const generateTileImage = async ({
    positivePrompt,
    negativePrompt = "",
    model,
    numImages,
    width = 512,
    height = 512,
    steps = 30,
    CFGScale = 15,
}: TextToImageParams): Promise<string> => {
    // For google:4@1, exclude steps and CFGScale
    const payload: Record<string, any> = {
        positivePrompt,
        negativePrompt,
        model,
        numImages,
        width,
        height,
    };

    if (model !== "google:4@1") {
        payload.steps = steps;
        payload.CFGScale = CFGScale;
    }

    const { data: imageUrl } = await api({}).post("/runware/text-to-image", payload);
    return imageUrl;
}