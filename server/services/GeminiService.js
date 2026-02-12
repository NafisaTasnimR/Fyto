import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateCareGuide = async (scientificName, location = "Bangladesh") => {
    try {
        console.log("🌿 Generating care guide for:", scientificName, "in", location);
        console.log("🔑 API Key present:", !!process.env.GEMINI_API_KEY);

        // Initialize inside the function so env vars are loaded
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
Generate plant care information in STRICT JSON format.

Plant: ${scientificName}
Location: ${location}

Return JSON with:
{
  "watering_schedule": "",
  "sunlight_requirement": "",
  "soil_type": "",
  "fertilizer_schedule": "",
  "pruning_guide": "",
  "repotting_frequency": "",
  "care_timeline": [
    "Week 1: ...",
    "Week 2: ...",
    "Month 1: ...",
    "Month 3: ..."
  ]
}

Do not include explanations.
Only return valid JSON.
`;

        const result = await model.generateContent(prompt);
        let text = result.response.text();

        text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        console.log("Cleaned response:", text.substring(0, 100) + "...");

        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        console.error("Error details:", error);
        throw new Error(`Failed to generate care guide: ${error.message}`);
    }
};
