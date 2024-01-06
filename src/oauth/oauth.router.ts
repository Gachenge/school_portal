import express from "express";
import * as oauthController from "./oauth.controller";

export const oauthRouter = express.Router();

oauthRouter.post("/sign_up", oauthController.signupController);
oauthRouter.post("/login", oauthController.loginController)
oauthRouter.post("/refresh", oauthController.refreshController)
oauthRouter.post("/logout", oauthController.logoutController)
oauthRouter.get("/verify_email/:token", oauthController.get_token)
oauthRouter.post("/forgot_password", oauthController.password_reset)
