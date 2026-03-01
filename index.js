import express from "express";
import "dotenv/config"
import cors from "cors"
import connectDB from "./src/DB/connectDB.js";
import authRouter from "./src/modules/auth/auth.controller.js";
import userRouter from "./src/modules/user/user.controller.js";

const app = express();

app.use(cors(
    {
        origin: ["https://codegad.vercel.app", "http://localhost:3000"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }
));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

connectDB();
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
// export default app;