import mongoose from "mongoose";

const challengeParticipationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },

    challengeType: {
        type: String,
        enum: ['daily', 'monthly', 'extra'],
        required: true
    },

    challengeSubType: {
        type: String,
        enum: ['image-quiz', 'riddle-quiz', 'task', 'milestone'],
        required: true
    },

    // External challenge identifier (from API)
    challengeId: {
        type: String,
        required: true
    },

    // Participation details
    isCorrect: {
        type: Boolean,
        default: null  // null for non-quiz challenges
    },

    pointsEarned: {
        type: Number,
        default: 0
    },

    bonusPoints: {
        type: Number,
        default: 0
    },

    // For monthly challenges
    completionProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    isCompleted: {
        type: Boolean,
        default: false
    },

    completedAt: {
        type: Date
    },

    // Metadata
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    participatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for efficient queries
challengeParticipationSchema.index({ userId: 1, challengeType: 1 });
challengeParticipationSchema.index({ userId: 1, participatedAt: -1 });
challengeParticipationSchema.index({ userId: 1, challengeId: 1 });

export default mongoose.model("ChallengeParticipation", challengeParticipationSchema);
