import Joi from "joi";

export const validateComment = (comment: { post: string, image?: string }) => {
    const commentSchema = Joi.object({
        post: Joi.string().required(),
        image: Joi.string().allow(null, ''),
    });
    return commentSchema.validate(comment)
}

export const validateId = (blog:{id: string}) => {
    const idSchema = Joi.object({
        id: Joi.string().guid({ version: 'uuidv4' })
    })
    return idSchema.validate(blog)
}
