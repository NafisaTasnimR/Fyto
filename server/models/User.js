import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },

    profilePic: {
        type: String,
        default: 'https://via.placeholder.com/150/4CAF50/ffffff?text=User'
    },
    bio: { type: String },

    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
    completedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],

    // Saved marketplace posts for later
    savedMarketplacePosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MarketplacePost"
    }],

    gardenShowcase: [{
        image: String,
        caption: String
    }],

    // Gamification fields
    scores: {
        dailyScore: { type: Number, default: 0 },
        monthlyScore: { type: Number, default: 0 },
        totalScore: { type: Number, default: 0 }
    },

    streaks: {
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastParticipationDate: { type: Date }
    },

    monthlyProgress: {
        month: { type: Number },  // 1-12
        year: { type: Number },
        challengesCompleted: { type: Number, default: 0 },
        lastReset: { type: Date }
    },

    // Extra Challenges tracking
    extraChallenges: {
        currentBatch: { type: Number, default: 1 }, // Which batch is currently visible (1-4)
        completedChallenges: [{ type: String }], // Array of challengeIds

        // Progress tracking for each challenge type
        progress: {
            postsCreated: { type: Number, default: 0 },
            plantsIdentified: { type: Number, default: 0 },
            journalsCreated: { type: Number, default: 0 },
            likesGiven: { type: Number, default: 0 },
            commentsCreated: { type: Number, default: 0 },
            likesReceived: { type: Number, default: 0 },
            dailyChallengesCompleted: { type: Number, default: 0 },
            consecutiveLoginDays: { type: Number, default: 0 },
            lastLoginDate: { type: Date }
        }
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Users", UserSchema);