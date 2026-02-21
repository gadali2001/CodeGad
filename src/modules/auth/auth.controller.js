import { Router } from "express";
import * as userAuthService from "./services/auth.service.js";
const userController = Router();

userController.post("/register", userAuthService.registerService);
userController.get("/verify/:token", userAuthService.verifyEmailService);
userController.post("/login", userAuthService.loginService);
userController.post("/refresh-token", userAuthService.refreshTokenService);
userController.post("/logout", userAuthService.logoutService);
userController.patch("/forget-password", userAuthService.forgetPasswordService);
userController.put("/reset-password", userAuthService.resetPasswordService);
export default userController;