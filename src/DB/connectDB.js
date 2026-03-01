import { connect } from "mongoose";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export default async function connectDB() {
  try {
    await connect(process.env.DB_URL);
    console.log("Database connected");
  } catch (error) {
    console.log(`error mongoose ${error}`);
  }
}
