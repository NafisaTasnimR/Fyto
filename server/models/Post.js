import mongoose from "mongoose";
import User from "./User.js";

const postSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },

    content: String,
    images: [String],

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Post", postSchema);
