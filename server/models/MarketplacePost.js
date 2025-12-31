import mongoose from "mongoose";

const marketplacePostSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
            phone: String,
            email: String
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
        }
    },
    {
        timestamps: true
    });

export default mongoose.model("MarketplacePost", marketplacePostSchema);
