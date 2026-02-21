import express from "express";
import "dotenv/config"
import cors from "cors"
import connectDB from "./src/DB/connectDB.js";
import authRouter from "./src/modules/auth/auth.controller.js";
import userRouter from "./src/modules/user/user.controller.js";

const app = express();

app.use(cors({
    origin: "https://codegad.vercel.app/",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

connectDB();
export default app;