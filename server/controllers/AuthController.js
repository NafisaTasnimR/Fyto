import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { trackChallengeProgress } from '../services/ExtraChallengeService.js';

const signup = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists", success: false });
        }
        const userModel = new UserModel({
            name,
            email,
            username,
            passwordHash: await bcrypt.hash(password, 10),
            profilePic: 'https://via.placeholder.com/150/4CAF50/ffffff?text=User'
        });
        await userModel.save();
        res.status(201).json({ message: "User created successfully", success: true });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password", success: false });
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password", success: false });
        }
        const token = jwt.sign(
            { email: user.email, _id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )

        // Track consecutive login for extra challenges
        await trackChallengeProgress(user._id, 'consecutive_login');

        res.status(200).json(
            {
                message: "Login successful",
                success: true,
                token,
                data: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    username: user.username,
                    profilePic: user.profilePic,
                    bio: user.bio,
                    isAdmin: user.isAdmin
                }
            }
        )

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export { signup, login };