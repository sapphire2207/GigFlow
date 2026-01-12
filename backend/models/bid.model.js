import mongoose, {Schema, model} from "mongoose";

const bidSchema = Schema({
    gigId: {
        type: Schema.Types.ObjectId,
        ref: "Gig",
        required: true,
    },
    freelancerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "hired", "rejected"],
        default: "pending",
    }
}, {timestamps: true});

export const Bid = mongoose.models.bid || model("Bid", bidSchema);