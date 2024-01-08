import Joi from "joi"

export const validateNewBook = (book:{title:string, author:string, copies:number}) => {
    const bookSchema = Joi.object({
        title: Joi.string().required(),
        author: Joi.string().required(),
        copies: Joi.number().required()
    })
    return bookSchema.validate(book)
}

export const validateId = (member:{id: string}) => {
    const idSchema = Joi.object({
        id: Joi.string().guid({ version: 'uuidv4' })
    })
    return idSchema.validate(member)
}

export const validateBorrow = (borrow: {bookId:string}) => {
    const borrowSchema = Joi.object({
        bookId: Joi.string().guid({ version: 'uuidv4' }),
    })
    return borrowSchema.validate(borrow)
}

export const validateEditBook = (book:{title:string, author:string, copies:number}) => {
    const bookSchema = Joi.object({
        title: Joi.string(),
        author: Joi.string(),
        copies: Joi.number()
    })
    return bookSchema.validate(book)
}

export const validateIdBody = (id: string) => {
    const idSchema = Joi.object({
        id: Joi.string().guid({ version: 'uuidv4' })
    })
    return idSchema.validate(id)
}
