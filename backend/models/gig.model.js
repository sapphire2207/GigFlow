import mongoose, {Schema, model} from "mongoose";

const gigSchema = Schema({
    title: {
        type: String,
        required: [true, "Title is Required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Description is Required"],
    },
    budget: {
        type: Number,
        required: true,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["open", "assigned"],
        default: "open",
    }
}, {timestamps: true});

export const Gig = mongoose.models.gig || model("Gig", gigSchema);