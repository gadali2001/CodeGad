import { connect } from "mongoose";

export default async function connectDB() {
    try {
        await connect(process.env.DB_URL);
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
}