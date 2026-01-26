import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
            passwordHash: await bcrypt.hash(password, 10)
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
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )
        res.status(200).json(
            {
                message: "Login successful",
                success: true,
                token,
                data: {
                    email: user.email
                }
            }
        )

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export { signup, login };