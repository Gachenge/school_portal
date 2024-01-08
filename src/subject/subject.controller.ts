import { getUser } from "../utils/helpers";
import { Request, Response } from "express";
import * as SubjectService from "../subject/subject.service"
import { NotFoundError, UserNotSignedIn } from "../utils/errors";
import { validateId, validateSubject } from "./subject.validator";

export const all_subjects =async (req: Request, resp: Response) => {
    try {
        const { role } = await getUser(req) ?? { role: null };
        if (role === 'USER') {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        const subjects = await SubjectService.allSubjects()
        return resp.status(200).json({ success: true, subjects })
    } catch (error: any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(403).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(401).json({ error: "Subject not found"})
        } else if (error.status) {
            return resp.status(error.status).json({ error: error.message })
        }
        return resp.status(500).json({ error: error.message })
    }
}

export const create_subject =async (req:Request, resp:Response) => {
    try {
        const { role } = await getUser(req) ?? { role: null };
        if (role !== 'ADMIN') {
            return resp.status(403).json({ error: "You are not authorised" })
        }
        const result = validateSubject(req.body)
        if (result.error) {
            return resp.status(400).json({ error: result.error.details });
        }
        const subject = await SubjectService.createSubject(result.value.name)
        return resp.status(201).json({ success: true, subject })
    } catch (error: any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(403).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(401).json({ error: "Subject not found"})
        } else if (error.status) {
            return resp.status(error.status).json({ error: error.message })
        }
        return resp.status(500).json({ error: error.message })
    }
}

export const get_subject_by_id =async (req:Request, resp:Response) => {
    try {
        const result = validateId({ id: req.params.id })
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { id } = result.value
        const { role } = await getUser(req) ?? { role: null };
        if (role === 'USER') {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        const subject = await SubjectService.subjectById(id)
        return resp.status(200).json({ success: true, subject })
    } catch (error: any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(403).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Subject not found"})
        } else if (error.status) {
            return resp.status(error.status).json({ error: error.message })
        }
        return resp.status(500).json({ error: error.message })
    }
}

export const edit_subject =async (req:Request, resp:Response) => {
    try {
        const results = validateId({ id: req.params.id })
        if (results.error) {
            return resp.status(400).json({ error: results.error.details })
        }
        const { id } = results.value
        const { role } = await getUser(req) ?? { role: null };
        if (role !== 'ADMIN') {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        const result = validateSubject(req.body)
        if (result.error) {
            return resp.status(400).json({ error: result.error.details });
        }
        const subject = await SubjectService.editSubject(id, result.value.name)
        return resp.status(200).json({ success: true, subject})
    } catch(error: any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(403).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(401).json({ error: "Subject not found"})
        } else if (error.status) {
            return resp.status(error.status).json({ error: error.message })
        }
        return resp.status(500).json({ error: error.message })
    }
}

export const delete_subject =async (req:Request, resp: Response) => {
    try {
        const result = validateId({ id: req.params.id })
        if (result.error) {
            return resp.status(400).json({ error: result.error.details })
        }
        const { id } = result.value
        
        const { role } = await getUser(req) ?? { role: null };
        if (role !== 'ADMIN') {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        await SubjectService.deleteSubject(id)
        resp.status(204).json()
    } catch (error:any){
        if (error instanceof UserNotSignedIn) {
            return resp.status(403).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(401).json({ error: "Subject not found"})
        } else if (error.status) {
            return resp.status(error.status).json({ error: error.message })
        }
        return resp.status(500).json({ error: error.message })
    }
}
