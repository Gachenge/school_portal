import express from "express";
import * as BlogController from "./blog.controller";
export const blogRouter = express.Router();

blogRouter.post("/", BlogController.createBlogController)
blogRouter.get("/", BlogController.getBlogsController)
blogRouter.get("/:id", BlogController.getBlogById)
blogRouter.patch("/:id", BlogController.editBlogById)
blogRouter.delete("/:id", BlogController.deleteBlogController)
