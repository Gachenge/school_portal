import express from "express";
import * as userController from "../users/users.controller"

export const userRouter = express.Router();

userRouter.get("/", userController.getUsers)
userRouter.get("/:id", userController.getUserById)
userRouter.patch("/:id", userController.editUserById)
userRouter.delete("/:id", userController.delUser)
