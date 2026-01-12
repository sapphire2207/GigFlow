import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
})

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes Import
import authRouter from "./routes/auth.routes.js";
import gigsRouter from "./routes/gigs.routes.js";
import bidsRouter from "./routes/bids.routes.js";

// Routes Declaration
app.use("/api/auth", authRouter);
app.use("/api/gigs", gigsRouter);
app.use("/api/bids", bidsRouter);

export default app;