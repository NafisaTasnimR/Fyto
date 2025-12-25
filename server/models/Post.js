import mongoose from "mongoose";
import User from "./User.js";

const postSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    content: String,
    images: [String],

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Post", postSchema);
