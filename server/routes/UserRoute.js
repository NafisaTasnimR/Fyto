import { Router } from "express";
import { getCurrentUser, getUserById, searchUsers } from "../controllers/UserController.js";
import verifyToken from "../middlewares/Authorization.js";

const router = Router();

// All routes require authentication
router.use(verifyToken);

router.get("/me", getCurrentUser);
router.get("/search", searchUsers);
router.get("/:userId", getUserById);

export default router;
