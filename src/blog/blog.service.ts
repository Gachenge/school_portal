import { Role } from "@prisma/client";
import { db } from "../utils/db.server";
import { AlreadyRegistered, ForbiddenError, NotFoundError } from "../utils/errors";


type Blog = {
    title: string;
    body: string;
    image?: string;
    author: string;
};

type Post = {
    userId: string;
    body: string;
    image?: string | null;
    author: object;
};

export const createBlog = async (blog: Blog, userId: string) => {
    try {
        const blogExist = await db.post.findFirst({
            where: {title:blog.title, body:blog.body, userId:userId}
        })
        if (blogExist) {
            throw new AlreadyRegistered("This blog has already been created")
        }
        // Create the blog post with a unique constraint check
        const createdBlog = await db.post.create({
            data: {
                title: blog.title,
                body: blog.body,
                image: blog.image,
                userId: userId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            }
        });
        return createdBlog;

    } catch (error: any) {
        throw error
    }
};

export const getBlogs = async () => {
    try {
        const blogs = await db.post.findMany({ include: { author: {
            select: {
                id: true,
                username: true,
                avatar: true
            }
        } }});
        return blogs;
    } catch (error: any) {
        throw error
    }
};

export const getBlog = async (id: string): Promise<Post> => {
    try {
        const blog = await db.post.findUnique({ where: { id }, 
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            }
        })

        if (!blog) {
            throw new NotFoundError("Blog not found");
        }

        return blog;
    } catch (error: any) {
        throw error
    }
};

export const editBlog = async (blog: Blog, id: string, userId: string) => {
    try {
        const existingBlog = await db.post.findUnique({ where: { id }})
        if (!existingBlog) {
            throw new NotFoundError("Blog not found")
        }
        if (existingBlog.userId !== userId) {
            throw new ForbiddenError("You are not authorised")
        }
        
        const updatedBlog = await db.post.update({
            where: { id },
            data: {
                title: blog.title,
                body: blog.body,
                image: blog.image,
            },
        });

        return updatedBlog;
    } catch (error: any) {
        throw error;
    }
};

export const authorizeCommentDeletion = (commentUserId: string, requestingUserId: string, userRole: Role) => {
    if (commentUserId !== requestingUserId && userRole !== 'ADMIN') {
        throw new ForbiddenError("You are not authorised to delete");
    }
};

export const deleteBlog = async (id: string, userId: string, role: Role) => {
    try {
        const blog = await getBlog(id);
        
        authorizeCommentDeletion(blog.userId, userId, role);

        const deletedBlog = await db.post.delete({ where: { id } });

        if (!deletedBlog) {
            throw new NotFoundError("Blog not found");
        }

        return deletedBlog;
    } catch (error: any) {
        throw error
    }
};

