import mongoose from "mongoose";
const Schema = mongoose.Schema;

const JournalSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Users",
            required: true,
            index: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        coverImage: {
            url: { type: String, required: true },
            width: Number,
            height: Number
        },

        totalWordCount: {
            type: Number,
            default: 0
        },

        // Optional future features
        isPublic: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default mongoose.model("Journals", JournalSchema);
