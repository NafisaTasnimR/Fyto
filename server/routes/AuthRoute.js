import { Router } from "express";
import { loginValidation, signupValidation } from "../middlewares/AuthValidation.js";
import { login, signup, searchUsers } from "../controllers/AuthController.js";
import verifyToken from "../middlewares/Authorization.js";

const router = Router();

router.post("/register", signupValidation, signup);
router.post("/login", loginValidation, login);
router.get("/search", verifyToken, searchUsers);

export default router;