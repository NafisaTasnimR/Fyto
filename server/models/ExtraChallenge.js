import mongoose from "mongoose";

const extraChallengeSchema = new mongoose.Schema({
    challengeId: {
        type: String,
        required: true,
        unique: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    points: {
        type: Number,
        required: true,
        default: 0
    },

    // What action triggers this challenge
    trackingType: {
        type: String,
        enum: [
            'post_create',
            'plant_identify',
            'journal_create',
            'like_give',
            'comment_create',
            'like_receive',
            'daily_challenge_complete',
            'consecutive_login'
        ],
        required: true
    },

    // Target count for completion
    targetCount: {
        type: Number,
        required: true,
        default: 1
    },

    // Batch grouping (1-4, showing 5 at a time)
    batch: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },

    // Order within the batch (1-5)
    orderInBatch: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for efficient queries
extraChallengeSchema.index({ batch: 1, orderInBatch: 1 });
extraChallengeSchema.index({ challengeId: 1 });

export default mongoose.model("ExtraChallenge", extraChallengeSchema);
