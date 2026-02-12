import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },

    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },

    content: {
        type: String,
        required: true,
    },

    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Comment", commentSchema);
