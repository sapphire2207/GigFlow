import { Gig } from "../models/gig.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createGig = asyncHandler(async (req, res) => {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
        throw new ApiError(400, "All fields are required");
    }

    const gig = await Gig.create({
        title,
        description,
        budget,
        ownerId: req.user._id,
    });

    res.status(201).json(new ApiResponse(201, gig, "Gig created successfully"));
});

export const getAllGigs = asyncHandler(async (req, res) => {
    const { search } = req.query;

    const filter = {
        status: "open",
        ...(search && {
            title: { $regex: search, $options: "i" }
        })
    };

    const gigs = await Gig.find(filter).populate("ownerId", "name email");

    res.status(200).json(new ApiResponse(200, gigs, "Gigs fetched successfully"));
});
