import express from "express";
import verifyToken from '../middlewares/Authorization.js';
import {
    getMyExtraChallenges,
    getMyCompletedChallenges,
    getMyChallengeStats
} from '../controllers/ExtraChallengeController.js';

const router = express.Router();

// Protect all routes with authentication
router.use(verifyToken);

// Get visible extra challenges (current batch of 5)
router.get("/", getMyExtraChallenges);

// Get all completed challenges
router.get("/completed", getMyCompletedChallenges);

// Get challenge statistics
router.get("/stats", getMyChallengeStats);

export default router;
