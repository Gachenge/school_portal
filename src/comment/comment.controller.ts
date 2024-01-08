import * as CommentService from "../comment/comment.service";
import { Request, Response } from "express";
import { getUser } from "../utils/helpers";
import { validateComment, validateId } from "./comment.validator";
import { ForbiddenError, NotFoundError, UserNotSignedIn } from "../utils/errors";

export const postComment = async (req: Request, resp: Response) => {
    try {
        const results = validateId({ id: req.params.id })
        if (results.error) {
            return resp.status(400).json({ error: results.error.details })
        }
        const { id } = results.value

        const { userId } = (await getUser(req)) ?? { userId: null };

        if (!userId) {
            return resp.status(401).json({ error: "You are not authorized" });
        }

        const result = validateComment(req.body);

        if (result.error) {
            return resp.status(400).json({ error: result.error.details });
        }

        const { post, image } = result.value;
        const comment = await CommentService.createComment(id, userId, post, image);

        return resp.status(201).json({ success: true, comment });
    } catch (error: any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in" });
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: error.message });
        } else {
            return resp.status(500).json({ error: error.message });
        }
    }
};

export const getComments =async (req:Request, resp: Response) => {
    try {
        const result = validateId({ id: req.params.id })
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { id } = result.value
        const comments = await CommentService.getComments(id)
        return resp.status(200).json({ success: true, comments})
    } catch (error: any) {
        return resp.status(500).json({ error: error.message })
    }
}

export const getCommentById =async (req:Request, resp: Response) => {
    try {
        const result = validateId({ id: req.params.id })
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { id } = result.value
        const comment = await CommentService.getCommentById(id)
        if (!comment) {
            resp.status(404).json('Comment not found')
        }
        return resp.status(200).json({ success: true, comment })
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return resp.status(404).json('Comment not found')
        }
        return resp.status(500).json('Internal server error')
    }
}

export const editCommentById = async (req: Request, resp: Response) => {
    try {
        const results = validateId({ id: req.params.id })
        if (results.error) {
            return resp.status(400).json({ error: results.error.details })
        }
        const { id } = results.value
        const result = validateComment(req.body);
        if (result.error) {
            return resp.status(400).json({ error: result.error.details });
        }
        const { post, image } = result.value;

        const { userId } = await getUser(req) ?? { userId: null };

        const updatedComment = await CommentService.editComment(id, post, image, userId);

        if (!updatedComment) {
            return resp.status(404).json({ error: "Comment not found" });
        }

        return resp.status(200).json({ success: true, updated: updatedComment });
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Comment not found" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "You are not authorised to edit this comment" })
        } else if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in" })
        } else if (error.status) {
            return resp.status(error.status).json({ error: error.message })
        }
        return resp.status(500).json({ error: "Internal server error" });
    }
};

export const deleteCommentById = async (req: Request, resp: Response) => {
    try {
        const result = validateId({ id: req.params.id })
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { id } = result.value
        const { userId, role } = await getUser(req) ?? { userId: null, role: null };

        const deleteComment = await CommentService.deleteComment(id, userId, role);
        if (!deleteComment) {
            return resp.status(404).json({ error: "Comment not found" });
        }
        return resp.status(204).json({ success: true, deleteComment });
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Comment not found" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "You are not authorised to edit this comment" })
        } else if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in" })
        } else if (error.status) {
            return resp.status(error.status).json({ error: error.message })
        }
        return resp.status(500).json({ error: error.message });
    }
};
