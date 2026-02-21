import { Schema, model } from "mongoose";

const blackListTokensSchema = new Schema({
    tokenId: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
}, { timestamps: true });

export default model("BlackListToken", blackListTokensSchema);