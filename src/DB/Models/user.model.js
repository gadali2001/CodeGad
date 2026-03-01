import { Schema, model } from "mongoose";
import { systemRoles } from "../../constants/constants.js";

const userSchema = new Schema({
    displayName: {
        type: String,
        trim: true,
    },
    userName: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: [true, "Username already exists"],
        index: true
    },
    dateOfBirth: {
        type: String,
        required: [true, "Date of birth is required"],
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Gender is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        trim: true,
        unique: [true, "Phone already exists"],
        index: true
    },
    country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
    },
    region: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: [true, "Email already exists"],
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        min: [6, "Password must be at least 6 characters long"],
        max: [12, "Password must be at most 12 characters long"]
    },
    role: {
        type: String,
        default: systemRoles.user,
        enum: Object.values(systemRoles)
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    otp: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default model("User", userSchema);