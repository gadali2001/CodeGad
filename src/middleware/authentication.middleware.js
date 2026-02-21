import jwt from "jsonwebtoken";
import BlackListToken from "../DB/Models/black-list-tokens.model.js";
import User from "../DB/Models/user.model.js";
export const authenticationService = () => {
    return async (req, res, next) => {
        try {
            const { accesstoken } = req.headers;
            // check if token is provided
            if (!accesstoken) {
                return res.status(401).json({ message: "Please Login" });
            }
            // check if token is verified
            const decodedToken = jwt.verify(accesstoken, process.env.JWT_SECRET_LOGIN);
            // check if token is blacklisted
            const isTokenBlacklisted = await BlackListToken.findOne({ tokenId: decodedToken.jti });
            if (isTokenBlacklisted) {
                return res.status(401).json({ message: "Token Blacklisted" });
            }
            // check if user is found
            const user = await User.findById(decodedToken.id, "-password -__v -createdAt -updatedAt -otp");
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }
            // check if user is banned
            if (user.isBanned) {
                return res.status(401).json({ message: "User is banned" });
            }
            // check if user is deleted
            if (user.isDeleted) {
                return res.status(401).json({ message: "User is deleted" });
            }
            req.loggedInUser = user;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token Expired" });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const authorizationService = (roles) => {
    return (req, res, next) => {
        try {
            const { role } = req.loggedInUser;
            if (!roles.includes(role)) {
                return res.status(403).json({ message: "Unauthorized" });
            }
            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}