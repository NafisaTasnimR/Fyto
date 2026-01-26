import { Router } from "express";
import { loginValidation, signupValidation } from "../middlewares/AuthValidation.js";
import { login, signup } from "../controllers/AuthController.js";

const router = Router();

router.post("/register", signupValidation, signup);
router.post("/login", loginValidation, login);

export default router;