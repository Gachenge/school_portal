import { getBlog } from "../blog/blog.service";
import { db } from "../utils/db.server";
import { ForbiddenError, NotFoundError } from "../utils/errors";
import { Role } from "@prisma/client";

type Post = {
    id: string,
    comment: string,
    postId: string,
    userId: string,
    image?: string
}

type PostResponse = {
    comment: string,
    postId: string,
    userId: string,
    image?: string
}

type Comment = {
    id: string,
    comment: string,
    postId: string,
    userId: string,
    image?: string,
}

export const createComment = async (postId: string, userId: string, comment: string, image: string) : Promise<PostResponse>=> {
    try {
        const post = await getBlog(postId)
        
        const newComment = await db.comment.create({
            data: {
                comment,
                postId,
                userId,
                image
            }
        })
        return newComment as PostResponse
    } catch (error: any) {
        throw error
    }
}

export const getComments =async (postId: string) => {
    try {
        const comments = await db.comment.findMany( { where: { postId }} )
        return comments
    } catch (error: any) {
        throw error
    }
}

export const getCommentById =async (id: string) => {
    try {
        const comment = await db.comment.findUnique( { where: { id }})
        if (!comment) {
            throw new NotFoundError("Comment not found")
        }
        return comment
    } catch (error: any) {
        throw error
    }
}

export const editComment =async (id:string, comment: string, image: string, userId: string) => {
    try {
        const existingComment = await getCommentById(id)
        if (!existingComment) {
            throw new NotFoundError("Comment not found")
        }
        if (existingComment.userId !== userId) {
            throw new ForbiddenError("You are not authorised")
        }
        const updatedComment = await db.comment.update({
            where: { id },
            data: {
                comment,
                image
            }
        })
        return updatedComment
    } catch (error: any) {
        throw error
    }
}

export const authorizeCommentDeletion = (commentUserId: string, requestingUserId: string, userRole: Role) => {
    if (commentUserId !== requestingUserId && userRole !== 'ADMIN') {
        throw new ForbiddenError("You are not authorised to delete");
    }
};

export const deleteComment = async (id: string, userId: string, role: Role) => {
    try {
        const comment = await getCommentById(id);
        authorizeCommentDeletion(comment.userId, userId, role);

        const deletedComment = await db.comment.delete({ where: { id } });

        if (!deletedComment) {
            throw new NotFoundError("Comment not found");
        }

        return deletedComment;
    } catch (error: any) {
        throw error
    }
};
