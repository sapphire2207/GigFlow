import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
