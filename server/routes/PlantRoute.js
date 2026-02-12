import express from "express";
import { upload } from "../middlewares/Upload.js";
import { detectPlantAndCare } from "../controllers/PlantController.js";
import verifyToken from '../middlewares/Authorization.js';

const router = express.Router();

router.use(verifyToken);

router.post("/identify", upload.single("image"), detectPlantAndCare);

export default router;