import { Request, Response } from "express"
import * as LibraryService from "../library/library.service"
import { getUser } from "../utils/helpers"
import { AlreadyRegistered, BookExists, BookNotAvailable, ForbiddenError, NotFoundError, UserHasOverdueBooks, UserNotSignedIn } from "../utils/errors"
import { validateBorrow, validateEditBook, validateId, validateIdBody, validateNewBook } from "./library.validator"

export const all_members =async (req:Request, resp:Response) => {
    try {
        const { role=null } = await getUser(req)
        if (role !== 'ADMIN' && role !== 'LIBRARIAN') {
            return resp.status(403).json({ error: "You are not authorised" })
        }
        const members = await LibraryService.allMembers()
        return resp.status(200).json({ success: true, members })
    } catch (error:any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in" })
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "User not found" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        return resp.status(500).json({ error: "Internal server error" })
    }
}

export const new_members =async (req:Request, resp:Response) => {
    try {
        const { role=null } = await getUser(req)
        if (role !== 'ADMIN' && role !== 'LIBRARIAN') {
            return resp.status(403).json({ error: "You are not authorised" })
        }
        const result = validateIdBody(req.body)
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { id } = result.value
        const member = await LibraryService.newMembers(id)
        return resp.status(200).json({ success:true, member })
    } catch (error:any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in" })
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "User not found" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "You are not authorised"})
        } else if (error instanceof AlreadyRegistered) {
            return resp.status(409).json({ error: error.message })
        }
        return resp.status(500).json({ error: "Internal server error" })
    }
}

export const member_by_id =async (req:Request, resp:Response) => {
    try {
        const { role=null } = await getUser(req)
        if (role !== 'ADMIN' && role !== 'LIBRARIAN') {
            return resp.status(403).json({ error: "You are not authorised" })
        }
        const result = validateId({ id: req.params.id })
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { id } = result.value
        const member = await LibraryService.memberById(id)
        return resp.status(200).json({ success:true, member })
    } catch (error:any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in" })
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Member not found" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        return resp.status(500).json({ error: "Internal server error" })
    }
}

export const delete_member =async (req:Request, resp:Response) => {
    try {
        const { role=null } = await getUser(req)
        if (role !== 'ADMIN' && role !== 'LIBRARIAN') {
            return resp.status(403).json({ error: "You are not authorised" })
        }
        const result = validateId({ id: req.params.id })
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { id } = result.value
        const member = await LibraryService.deleteMember(id)
        return resp.status(204).json()
    } catch (error:any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in" })
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Member not found" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        return resp.status(500).json({ error: "Internal server error" })
    }
}

export const all_books =async (req:Request, resp:Response) => {
    try {
        const { userId=null, role='USER' } = await getUser(req)
        const books = await LibraryService.allBooks(role, userId)
        
        return resp.status(200).json({ success:true, books})
    } catch (error:any) {
        console.log(error)
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in" })
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Member not found" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        return resp.status(500).json({ error: "Internal server error" })
    }
}

export const new_book =async (req:Request, resp:Response) => {
    try {
        const { role=null } = await getUser(req)
        if (role !== 'ADMIN' && role !== 'LIBRARIAN') {
            return resp.status(403).json({ error: "You are not authorised" })
        }
        const result = validateNewBook(req.body)
        if (result.error) {
            return resp.status(400).json({ error: result.error.message })
        }
        const { title, author, copies } = result.value
        const book = await LibraryService.newBooks(title, author, copies)
        return resp.status(200).json({ success:true, book })
    } catch (error:any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in" })
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Member not found" })
        } else if (error instanceof BookExists) {
            return resp.status(409).json({ error: "Book already registered" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        return resp.status(500).json({ error: "Internal server error" })
    }
}

export const book_by_id =async (req:Request, resp:Response) => {
    try {
        const { userId=null, role='USER' } = await getUser(req)
        
        const result = validateId({id: req.params.id})
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { id } = result.value
        const book = await LibraryService.bookById(id, userId, role)
        return resp.status(200).json({ success:true, book })
    } catch (error:any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in" })
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Book not found" })
        } else if (error instanceof BookExists) {
            return resp.status(409).json({ error: "Book already registered" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        return resp.status(500).json({ error: "Internal server error" })
    }
}

export const edit_book =async (req:Request, resp:Response) => {
    try {
        const { userId=null, role='USER' } = await getUser(req)
        
        const result = validateId({id: req.params.id})
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { id } = result.value
        const results = validateEditBook(req.body)
        if (results.error) {
            return resp.status(400).json({ error: results.error.details })
        }
        const { title, author, copies } = results.value
        const newBook = await LibraryService.editBook(id, userId, role, title, author, copies)
        return resp.status(200).json({ success:true, newBook })
    } catch (error:any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in" })
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Book not found" })
        } else if (error instanceof BookExists) {
            return resp.status(409).json({ error: "Book already registered" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        return resp.status(500).json({ error: "Internal server error" })
    }
}

export const del_book =async (req:Request, resp:Response) => {
    try {
        const { role=null } = await getUser(req)
        if (role !== 'ADMIN' && role !== 'LIBRARIAN') {
            return resp.status(403).json({ error: "You are not authorised" })
        }
        const result = validateId({ id: req.params.id })
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { id } = result.value
        await LibraryService.deleteBook(id)
        return resp.status(204).json()
    } catch (error:any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in" })
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Book not found" })
        } else if (error instanceof BookExists) {
            return resp.status(409).json({ error: "Book already registered" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        return resp.status(500).json({ error: "Internal server error" })
    }
}

export const borrow_book =async (req:Request, resp:Response) => {
    try {
        const { userId=null } = await getUser(req)
        const result = validateBorrow(req.body)
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { bookId } = result.value
        const borrow = await LibraryService.borrow(bookId, userId)
        return resp.status(200).json({ success:true, borrow })
    } catch (error:any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in" })
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "You are not a member" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "You are not authorised"})
        } else if (error instanceof BookNotAvailable) {
            return resp.status(404).json({ error: "Book not available" })
        } else if (error instanceof UserHasOverdueBooks) {
            return resp.status(401).json({ error: "You have overdue books"})
        }
        return resp.status(500).json({ error: "Internal server error" })   
    }
}

export const return_book =async (req:Request, resp:Response) => {
    try {
        const { userId=null } = await getUser(req)
        const result = validateBorrow(req.body)
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { bookId } = result.value
        const borrow = await LibraryService.returnBook(bookId, userId)
        return resp.status(200).json({ success:true, borrow})
    } catch (error:any) {
        console.log(error)
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in" })
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "You are not a member" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "You are not authorised"})
        } else if (error instanceof BookNotAvailable) {
            return resp.status(404).json({ error: "Book not available" })
        } else if (error instanceof UserHasOverdueBooks) {
            return resp.status(401).json({ error: "You have overdue books"})
        }
        return resp.status(500).json({ error: "Internal server error" })
    }
}
