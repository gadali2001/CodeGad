import { Router } from "express";
import * as UserService from "./services/profile.service.js";
import { authenticationService, authorizationService } from "../../middleware/authentication.middleware.js";
import { systemRoles } from "../../constants/constants.js";

const userController = Router();
userController.use(authenticationService());

const { admin } = systemRoles;

userController.get("/profile", UserService.getProfileService);
userController.patch("/update-password", UserService.updatePasswordService);
userController.get("/all-users", authorizationService([admin]), UserService.allUsersService);
userController.patch('/toggle-ban/:userId', authorizationService([admin]), UserService.toggleBanService);

export default userController;