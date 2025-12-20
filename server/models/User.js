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

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Users", UserSchema);