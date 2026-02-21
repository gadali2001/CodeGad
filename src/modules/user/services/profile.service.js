import User from "../../../DB/Models/user.model.js";
export const getProfileService = async (req, res) => {
    try {
        const user = {
            userName: req.loggedInUser.userName,
            displayName: req.loggedInUser.displayName,
            email: req.loggedInUser.email,
            role: req.loggedInUser.role
        }
        res.status(200).json({ message: "User profile fetched successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updatePasswordService = async (req, res) => {
    try {
        const { _id } = req.loggedInUser;
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.password !== oldPassword) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "New password and confirm new password do not match" });
        }
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const allUsersService = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: "Users fetched successfully", users });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}