import mongoose from "mongoose";

const postReportSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'postModel',
        index: true
    },

    postModel: {
        type: String,
        required: true,
        enum: ["Post", "MarketplacePost"]
    },

    postAuthorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },

    reports: [{
        reporterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    reportCount: {
        type: Number,
        default: 0,
        index: true
    },

    status: {
        type: String,
        enum: ["pending", "reviewed", "dismissed", "deleted"],
        default: "pending",
        index: true
    },

    adminNotificationSent: {
        type: Boolean,
        default: false
    },

    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },

    reviewedAt: {
        type: Date
    },

    adminNotes: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for efficient queries
postReportSchema.index({ postId: 1, postModel: 1 }, { unique: true });
postReportSchema.index({ reportCount: 1, status: 1 });

export default mongoose.model("PostReport", postReportSchema);
