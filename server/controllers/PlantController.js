import { identifyPlant } from "../services/PlantNetService.js";
import { generateCareGuide } from "../services/GeminiService.js";
import { searchPlants, getPlantById } from "../services/TrefleService.js";

export const detectPlantAndCare = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        console.log("File received:", req.file.originalname, req.file.size, "bytes");

        const plant = await identifyPlant(req.file.buffer);
        console.log("Plant identified:", plant);

        // Get location from request body or query params, default to "Bangladesh"
        const location = req.body.location || req.query.location || "Bangladesh";
        console.log("Using location:", location);

        const careInfo = await generateCareGuide(plant.scientificName, location);
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

// Search plants by name
export const searchPlantsByName = async (req, res) => {
    try {
        // Extract search query - required
        const { q, query } = req.query;
        const searchQuery = q || query;

        if (!searchQuery || searchQuery.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required. Use ?q=plant_name'
            });
        }

        // Extract pagination parameters - optional with defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;

        const result = await searchPlants(searchQuery, page, limit);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Search plants error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to search plants.',
            error: error.message
        });
    }
};

// Get plant details by ID
export const getPlantDetails = async (req, res) => {
    try {
        const { plantId } = req.params;

        if (!plantId) {
            return res.status(400).json({
                success: false,
                message: 'Plant ID is required.'
            });
        }

        const result = await getPlantById(plantId);

        if (!result || !result.data) {
            return res.status(404).json({
                success: false,
                message: 'Plant not found.'
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Get plant details error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get plant details.',
            error: error.message
        });
    }
};