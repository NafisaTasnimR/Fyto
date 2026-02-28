import express from "express";
import { upload } from "../middlewares/Upload.js";
import { detectPlantAndCare, searchPlantsByName, getPlantDetails } from "../controllers/PlantController.js";
import verifyToken from '../middlewares/Authorization.js';

const router = express.Router();

router.use(verifyToken);

// Plant identification by image
router.post("/identify", upload.single("image"), detectPlantAndCare);

// Search plants by name (query params: q or query, page, limit)
router.get("/search", searchPlantsByName);

// Get detailed plant information by ID
router.get("/:plantId", getPlantDetails);

export default router;