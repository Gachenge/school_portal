import { Request, Response } from "express";
import { validateCreateBlog, validateEditBlog, validateId } from "./blog.validator";
import * as BlogService from "../blog/blog.service";
import { AlreadyRegistered, ForbiddenError, NotFoundError, UserNotSignedIn } from "../utils/errors";
import { getUser } from "../utils/helpers";

export const createBlogController = async (req: Request, resp: Response) => {
    try {
        const { userId } = await getUser(req) ?? { userId: null };

        if (!userId) {
            return resp.status(401).json({ error: 'User not authenticated' });
        }

        const result = validateCreateBlog(req.body);

        if (result.error) {
            return resp.status(400).json({ error: result.error.details });
        }

        const newPost = result.value;

        const newBlog = await BlogService.createBlog(newPost, userId);

        return resp.status(201).json({ success: true, newBlog });
    } catch (error: any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "User not signed in"})
        } else if (error instanceof AlreadyRegistered) {
            return resp.status(409).json({ error: error.message })
        } else if (error.status) {
            return resp.status(error.status).json({ error: error.message });
        }
        return resp.status(500).json({ error: error.message });
    }
};


export const getBlogsController = async (req: Request, resp: Response) => {
    try {
        const blogs = await BlogService.getBlogs();        

        return resp.status(200).json({ success: true, blogs });
    } catch (error: any) {
        return resp.status(error.status || 500).json({ error: error.message || 'Internal server error' });
    }
};


export const getBlogById = async (req: Request, res: Response) => {
    try {
        const result = validateId({ id: req.params.id })
        if (result.error) {
            return res.status(400).json({ error: result.error.details })
        }
        const { id } = result.value

        const blog = await BlogService.getBlog(id);

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        return res.status(200).json({ success: true, blog });
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json("Blog not found")
        } else if (error.status) {
            return res.status(error.status).json(error.message)
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const editBlogById = async (req: Request, resp: Response) => {
    try {
        const result = validateId({ id: req.params.id })
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { id } = result.value
        const results = validateEditBlog(req.body)
        if (results.error) {
            return resp.status(400).json({ error: results.error.details })
        }
        const blog = results.value
        const { userId } = await getUser(req) ?? { userId: null };

        if (!userId) {
            return resp.status(401).json({ error: 'User not authenticated' });
        }

        const updates = await BlogService.editBlog(blog, id, userId);
        if (!updates) {
            return resp.status(404).json({ error: 'Blog not found' });
        }

        return resp.status(200).json({ success: true, updates });
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Blog not found" })
        } else if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in"})
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "Only the author can update this"})
        }
        return resp.status(error.status || 500).json({ error: error.details || 'Internal server error' });
    }
};

export const deleteBlogController = async (req: Request, resp: Response) => {
    try {
        const result = validateId({ id: req.params.id })
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { id } = result.value
        const { userId, role } = await getUser(req) ?? { userId: null, role: null };

        const deleteBlog = await BlogService.deleteBlog(id, userId, role);
        if (!deleteBlog) {
            return resp.status(404).json({ error: "Blog not found" });
        }
        return resp.status(204).json();
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Blog not found" });
        } else if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in"})
        }
        return resp.status(500).json({ error: error.message });
    }
};
