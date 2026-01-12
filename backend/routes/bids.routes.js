import { Router } from "express";
import {
    createBid,
    getBidsForGig,
    getHiredFreelancers,
    hireBid
} from "../controllers/bids.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createBid);
router.get("/:gigId", verifyJWT, getBidsForGig);
router.patch("/:bidId/hire", verifyJWT, hireBid);
router.get("/hired/me", verifyJWT, getHiredFreelancers);

export default router;
