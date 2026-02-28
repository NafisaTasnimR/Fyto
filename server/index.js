import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import { deleteExpiredPosts } from "./services/MarketplaceCleanupService.js";
import AuthRouter from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import PostRoute from "./routes/PostRoute.js";
import CommentRoute from "./routes/CommentRoute.js";
import MarketplaceRoute from "./routes/MarketplaceRoute.js";
import JournalRoute from "./routes/JournalRoute.js";
import PlantRoute from "./routes/PlantRoute.js";
import GamificationRoute from "./routes/GamificationRoute.js";
import NotificationRoute from "./routes/NotificationRoute.js";
import ReportRoute from "./routes/ReportRoute.js";
import ExtraChallengeRoute from "./routes/ExtraChallengeRoute.js";

const app = express();
connectDB();

// Clean up expired marketplace posts on server startup
deleteExpiredPosts().then(() => {
    console.log('✅ Initial cleanup of expired marketplace posts completed');
});

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
app.use("/api/comments", CommentRoute);
app.use("/api/marketplace", MarketplaceRoute);
app.use("/api/journals", JournalRoute);
app.use("/api/plants", PlantRoute);
app.use("/api/gamification", GamificationRoute);
app.use("/api/notifications", NotificationRoute);
app.use("/api/reports", ReportRoute);
app.use("/api/extra-challenges", ExtraChallengeRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})