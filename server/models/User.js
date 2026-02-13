import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    profilePic: { type: String },
    bio: { type: String },

    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
    completedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],

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

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Users", UserSchema);