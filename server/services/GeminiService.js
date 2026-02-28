import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateCareGuide = async (scientificName, location = "Bangladesh") => {
  try {
    console.log("🌿 Generating care guide for:", scientificName, "in", location);
    console.log("🔑 API Key present:", !!process.env.GEMINI_API_KEY);

    // Initialize inside the function so env vars are loaded
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Generate comprehensive plant care information in STRICT JSON format for the entire lifecycle from planting to full maturity.

Plant: ${scientificName}
Location: ${location}

Return JSON with:
{
  "watering_schedule": "Detailed watering instructions based on growth stage",
  "sunlight_requirement": "Sunlight needs throughout the plant's life",
  "soil_type": "Soil requirements and amendments",
  "fertilizer_schedule": "Fertilization plan from seedling to adult",
  "pruning_guide": "Pruning techniques for each growth stage",
  "repotting_frequency": "When and how to repot (if applicable)",
  "care_timeline": [
    "Week 1-2 (Seedling Stage): Specific care tasks for new seedlings",
    "Week 3-4: Care instructions as plant establishes",
    "Month 2-3: Early growth care",
    "Month 4-6: Continued establishment care",
    "Month 7-12 (End of Year 1): First year care summary",
    "Year 2: Second year growth care and milestones",
    "Year 3: Third year development",
    "Year 4-5: Maturing plant care",
    "Year 6-10: Approaching maturity care",
    "Year 10+ (Adult Stage): Mature tree/plant maintenance and care"
  ]
}

IMPORTANT: 
- The care_timeline must be comprehensive and cover the ENTIRE growth period from seedling/young plant to full adult maturity.
- Include specific care tasks, growth milestones, and expected developments at each stage.
- Adjust timeline based on the typical growth rate of this species (some plants mature faster than others).
- If the plant reaches maturity earlier than 10 years, adjust accordingly.
- If it takes longer than 10 years to reach full maturity, extend the timeline appropriately.
- Each timeline entry should include specific actionable care instructions for that period.

Do not include explanations outside the JSON.
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
