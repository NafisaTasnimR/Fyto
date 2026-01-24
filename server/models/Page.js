import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PageSchema = new Schema(
    {
        journalId: {
            type: Schema.Types.ObjectId,
            ref: "Journals",
            required: true,
            index: true
        },

        pageNumber: {
            type: Number,
            required: true
        },

        backgroundColor: {
            type: String,
            default: "#FFFFFF"
        },

        pageSize: {
            width: { type: Number, default: 800 },
            height: { type: Number, default: 1000 }
        }
    },
    { timestamps: true }
);

PageSchema.index({ journalId: 1, pageNumber: 1 }, { unique: true });

export default mongoose.model("Pages", PageSchema);
