import Joi from "joi"

export const validateCreateBlog = (post: {body: string}) => {
    const blogSchema = Joi.object ({
        title: Joi.string(),
        body: Joi.string().required(),
        image: Joi.string()
    })

    return blogSchema.validate(post)
}

export const validateGetBlogById = (id: {params: string}) => {
    const idSchema = Joi.object ({
        params: Joi.string().required(),
    })
    return idSchema.validate(id)
}

export const validateId = (blog:{id: string}) => {
    const idSchema = Joi.object({
        id: Joi.string().guid({ version: 'uuidv4' })
    })
    return idSchema.validate(blog)
}

export const validateEditBlog = (blog: {title:string, body:string, image:string}) => {
    const editSchema = Joi.object({
        title: Joi.string(),
        body: Joi.string(),
        image: Joi.string()
    })
    return editSchema.validate(blog)
}
