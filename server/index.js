import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

const app = express();
dotenv.config();
connectDB();

app.get("/", (req, res) => {
    res.send("Server is ready!")
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})