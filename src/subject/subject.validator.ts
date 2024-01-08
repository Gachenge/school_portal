import Joi from "joi"

export const validateSubject = (subject: {name: string}) => {
    const subjectSchema = Joi.object({
        name: Joi.string().required()
    })
    return subjectSchema.validate(subject)
}

export const validateId = (blog:{id: string}) => {
    const idSchema = Joi.object({
        id: Joi.string().guid({ version: 'uuidv4' })
    })
    return idSchema.validate(blog)
}
