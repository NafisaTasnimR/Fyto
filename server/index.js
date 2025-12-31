import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import AuthRouter from "./routes/AuthRoute.js";
import PostRoute from "./routes/PostRoute.js";
import MarketplaceRoute from "./routes/MarketplaceRoute.js";

const app = express();
dotenv.config();
connectDB();

app.get("/", (req, res) => {
    res.send("Server is ready!")
})

app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", AuthRouter);
app.use("/posts", PostRoute);
app.use("/api/marketplace", MarketplaceRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})