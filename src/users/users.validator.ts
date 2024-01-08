import Joi from "joi"

export const validateId = (blog:{id: string}) => {
    const idSchema = Joi.object({
        id: Joi.string().guid({ version: 'uuidv4' })
    })
    return idSchema.validate(blog)
}

export const validateEditUser = (user: {username:string, email:string, phone:string, avatar:string}) => {
    const userSchema = Joi.object({
        username: Joi.string().alphanum().min(5).max(10),
        email: Joi.string().email(),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/),
        avatar: Joi.string(),
    })
    return userSchema.validate(user)
}

export const validatePasswordReset = (user: {password:string, confirm_password:string}) => {
    const passwordSchema = Joi.object({
        old_password: Joi.string(),
        password: Joi.string().alphanum().min(5).max(10).required(),
        confirm_password: Joi.ref('password')
    })
    return passwordSchema.validate(user)
}
