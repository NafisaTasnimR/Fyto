import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        index: true
    },

    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },

    type: {
        type: String,
        enum: ["like", "comment", "reply", "post_report", "admin_action"],
        required: true
    },

    postId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'postModel'
    },

    postModel: {
        type: String,
        enum: ["Post", "MarketplacePost"]
    },

    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },

    reportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostReport"
    },

    message: {
        type: String,
        required: true
    },

    isRead: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Index for efficient queries
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, isRead: 1 });

export default mongoose.model("Notification", notificationSchema);
