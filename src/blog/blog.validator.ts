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
