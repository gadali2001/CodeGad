import { Router } from "express";
import * as UserService from "./services/profile.service.js";
import { authenticationService, authorizationService } from "../../middleware/authentication.middleware.js";
const userController = Router();
userController.use(authenticationService());

userController.get("/profile", UserService.getProfileService);
userController.patch("/update-password", UserService.updatePasswordService);
userController.get("/all-users", authorizationService(["admin"]), UserService.allUsersService);
export default userController;