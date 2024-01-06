import Joi from "joi";

export const validateComment = (comment: { post: string, image?: string }) => {
    const commentSchema = Joi.object({
        post: Joi.string().required(),
        image: Joi.string().allow(null, ''),
    });
    return commentSchema.validate(comment)
}
