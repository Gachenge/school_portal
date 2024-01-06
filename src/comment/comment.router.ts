import express from "express";
import * as commentController from "../comment/comment.controller"

export const commentRouter = express.Router();

commentRouter.post("/:id/comment", commentController.postComment)
commentRouter.get("/:id/comment", commentController.getComments)
commentRouter.get("/:id", commentController.getCommentById)
commentRouter.patch("/:id", commentController.editCommentById)
commentRouter.delete("/:id", commentController.deleteCommentById)
