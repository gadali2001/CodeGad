import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "../../../DB/Models/user.model.js";
import BlackListToken from "../../../DB/Models/black-list-tokens.model.js";
import { emitter } from "../../../services/send-email.service.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";



// register User service done
export const registerService = async (req, res) => {
    try {
        const { displayName, userName, dateOfBirth, gender, phone, country, city, region, email, password, confirmPassword } = req.body;

        // check if password and confirmPassword are the same
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        // check if username already exists
        const username = await User.findOne({ userName });
        if (username) {
            return res.status(400).json({ message: "Username already exists" });
        }
        // check if phone already exists
        const userPhone = await User.findOne({ phone });
        if (userPhone) {
            return res.status(400).json({ message: "Phone already exists" });
        }
        // check if email already exists
        const userEmail = await User.findOne({ email });
        if (userEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        // send verification email
        const __dirname = path.dirname(fileURLToPath(import.meta.url))
        const filePath = path.join(__dirname, "../../../utils/verifyEmail.html");
        let html = fs.readFileSync(filePath, "utf-8");
        const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: "10m" });
        html = html.replace("{{verifyURL}}", `${req.protocol}://${req.headers.host}/api/auth/verify/${token}`);
        emitter.emit("SendEmail", { to: email, subject: "Verify Your Email - CodeGad", html: html });

        // create user
        await User.create({ displayName, userName, dateOfBirth, gender, phone, country, city, region, email, password });
        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// verify email service done
export const verifyEmailService = async (req, res) => {
    try {
        const { token } = req.params;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOneAndUpdate({ email: decodedToken.email }, { isEmailVerified: true });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token Expired" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

// login User service done
export const loginService = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(404).json({ message: "email or password is not correct" });
        }
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_LOGIN, { expiresIn: "10m", jwtid: uuidv4() });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_REFRESH, { expiresIn: "1d", jwtid: uuidv4() });
        res.status(200).json({ message: "User logged in successfully", accessToken, refreshToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// refresh token service
export const refreshTokenService = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_LOGIN, { expiresIn: "10m", jwtid: uuidv4() });
        res.status(200).json({ message: "Token refreshed successfully", accessToken });
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token Expired" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

// logout User service
export const logoutService = async (req, res) => {
    try {
        const { accessToken, refreshToken } = req.body;
        const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET_LOGIN);
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
        await BlackListToken.insertMany([{ tokenId: decodedAccessToken.jti }, { tokenId: decodedRefreshToken.jti }]);
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token Expired" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

// forget password service done
export const forgetPasswordService = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        // Send OTP
        const __dirname = path.dirname(fileURLToPath(import.meta.url))
        const filePath = path.join(__dirname, "../../../utils/forgetPassword.html");
        let html = fs.readFileSync(filePath, "utf-8");
        html = html.replace("{{OTP}}", otp);
        emitter.emit("SendEmail", { to: user.email, subject: "Reset Your Password - CodeGad", html: html });
        user.otp = otp;
        await user.save();
        res.status(200).json({ message: "Reset password email sent successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// reset password service done
export const resetPasswordService = async (req, res) => {
    try {
        const { email, otp, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        await User.updateOne({ email }, { password: password, $unset: { otp: "" } });
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
