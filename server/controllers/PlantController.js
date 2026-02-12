import { identifyPlant } from "../services/PlantNetService.js";
import { generateCareGuide } from "../services/GeminiService.js";

export const detectPlantAndCare = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        console.log("File received:", req.file.originalname, req.file.size, "bytes");

        const plant = await identifyPlant(req.file.buffer);
        console.log("Plant identified:", plant);

        const careInfo = await generateCareGuide(plant.scientificName);
        console.log("Care info received:", careInfo ? "Success" : "Not found");

        res.json({
            plant,
            care: careInfo || "Care information not found"
        });
    } catch (err) {
        console.error("Plant detection error:", err.message);
        console.error("Full error:", err);
        res.status(500).json({
            error: "Plant detection failed",
            message: err.message,
            details: err.response?.data || null
        });
    }
};