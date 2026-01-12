import { Router } from "express";
import { createGig, getAllGigs } from "../controllers/gigs.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllGigs);
router.post("/", verifyJWT, createGig);

export default router;
