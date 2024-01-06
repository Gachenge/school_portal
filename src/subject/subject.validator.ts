import Joi from "joi"

export const validateSubject = (subject: {name: string}) => {
    const subjectSchema = Joi.object({
        name: Joi.string().required()
    })
    return subjectSchema.validate(subject)
}