import { Router } from "express";
import {
    getCurrentUser,
    getUserById,
    searchUsers,
    getUserProfile,
    updateProfile,
    updateGardenShowcase
} from "../controllers/UserController.js";
import verifyToken from "../middlewares/Authorization.js";
import { validateUpdateProfile, validateGardenShowcase } from "../middlewares/UserValidation.js";

const router = Router();

// All routes require authentication
router.use(verifyToken);

router.get("/me", getCurrentUser);
router.put("/me", validateUpdateProfile, updateProfile);
router.put("/me/garden-showcase", validateGardenShowcase, updateGardenShowcase);
router.get("/search", searchUsers);
router.get("/:userId/profile", getUserProfile);
router.get("/:userId", getUserById);

export default router;
