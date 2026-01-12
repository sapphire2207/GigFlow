import mongoose from "mongoose";
import { Bid } from "../models/bid.model.js";
import { Gig } from "../models/gig.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { emitToUser } from "../config/socket.js";

export const createBid = asyncHandler(async (req, res) => {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || !price) {
        throw new ApiError(400, "All fields are required");
    }

    const gig = await Gig.findById(gigId);
    if (!gig || gig.status !== "open") {
        throw new ApiError(400, "Gig not available for bidding");
    }

    const bid = await Bid.create({
        gigId,
        freelancerId: req.user._id,
        message,
        price,
    });

    res.status(201).json(new ApiResponse(201, bid, "Bid submitted successfully"));
});

export const getBidsForGig = asyncHandler(async (req, res) => {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig) {
        throw new ApiError(404, "Gig not found");
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied");
    }

    const bids = await Bid.find({ gigId })
        .populate("freelancerId", "name email");

    res.status(200).json(new ApiResponse(200, bids, "Bids fetched successfully"));
});

export const hireBid = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { bidId } = req.params;

        const bid = await Bid.findById(bidId)
            .populate("freelancerId", "name email")
            .session(session);
        
        if (!bid) {
            throw new ApiError(404, "Bid not found");
        }

        const gig = await Gig.findById(bid.gigId).session(session);
        if (!gig || gig.status === "assigned") {
            throw new ApiError(400, "Gig already assigned");
        }

        if (gig.ownerId.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Unauthorized");
        }

        gig.status = "assigned";
        await gig.save({ session });

        bid.status = "hired";
        await bid.save({ session });

        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bid._id } },
            { status: "rejected" },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        // Send real-time notification to the hired freelancer
        const freelancerId = bid.freelancerId._id.toString();
        const notificationSent = emitToUser(freelancerId, "hired", {
            message: `You have been hired for "${gig.title}"!`,
            gigId: gig._id,
            gigTitle: gig.title,
            gigBudget: gig.budget,
            clientName: req.user.name,
            bidPrice: bid.price,
            timestamp: new Date()
        });

        console.log(`Notification sent to freelancer ${freelancerId}:`, notificationSent);

        res.status(200).json(
            new ApiResponse(
                200, 
                { 
                    bid, 
                    gig,
                    notificationSent 
                }, 
                "Freelancer hired successfully"
            )
        );

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

export const getHiredFreelancers = asyncHandler(async (req, res) => {
    const clientId = req.user._id;

    const hiredBids = await Bid.find({ status: "hired" })
        .populate({
            path: "gigId",
            match: { ownerId: clientId }, 
            select: "title budget"
        })
        .populate({
            path: "freelancerId",
            select: "name email"
        });

    const filteredBids = hiredBids.filter(bid => bid.gigId !== null);

    res.status(200).json(
        new ApiResponse(
            200,
            filteredBids,
            "Hired freelancers fetched successfully"
        )
    );
});