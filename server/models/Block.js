import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BlockSchema = new Schema(
    {
        pageId: {
            type: Schema.Types.ObjectId,
            ref: "Pages",
            required: true,
            index: true
        },

        type: {
            type: String,
            enum: ["text", "image"],
            required: true
        },

        position: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 }
        },

        text: {
            type: String,
            default: ""
        },

        styles: {
            fontFamily: { type: String, default: "Arial" },
            fontSize: { type: Number, default: 14 },
            color: { type: String, default: "#000000" },
            bold: { type: Boolean, default: false },
            italic: { type: Boolean, default: false },
            underline: { type: Boolean, default: false },
            strike: { type: Boolean, default: false },
            alignment: {
                type: String,
                enum: ["left", "center", "right", "justify"],
                default: "left"
            },
            lineHeight: { type: Number, default: 1.4 }
        },

        image: {
            url: { type: String },
            width: { type: Number },
            height: { type: Number }
        },

        order: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

export default mongoose.model("Blocks", BlockSchema);
