import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import AuthRouter from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import PostRoute from "./routes/PostRoute.js";
import MarketplaceRoute from "./routes/MarketplaceRoute.js";
import JournalRoute from "./routes/JournalRoute.js";

const app = express();
dotenv.config();
connectDB();

app.get("/", (req, res) => {
    res.send("Server is ready!")
})

app.use(cors({
    origin: '*',
    credentials: false
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRoute);
app.use("/api/posts", PostRoute);
app.use("/api/marketplace", MarketplaceRoute);
app.use("/api/journals", JournalRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})