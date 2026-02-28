import mongoose from "mongoose";

const marketplacePostSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true
        },

        photos: {
            type: [String],
            required: true
        },

        treeName: {
            type: String,
            required: true,
            trim: true
        },

        treeType: {
            type: String,
            required: true,
            index: true
        },

        offering: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        postType: {
            type: String,
            enum: ["sell", "exchange", "donate"],
            required: true,
            index: true
        },

        price: {
            type: Number,
            default: 0
        },

        contactInfo: {
            type: String,
            required: true
        },

        treeAge: {
            type: Number,
            index: true
        },

        status: {
            type: String,
            enum: ["available", "unavailable"],
            default: "available",
            index: true
        },

        // Expiration date - post will be auto-deleted after this date
        expiresAt: {
            type: Date,
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    });

// TTL Index - MongoDB will automatically delete documents after expiresAt date
// The cleanup runs every 60 seconds in MongoDB
marketplacePostSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("MarketplacePost", marketplacePostSchema);
