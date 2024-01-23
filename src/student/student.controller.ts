import { getUser } from "../utils/helpers"
import { Request, Response } from "express"
import * as StudentService from "../student/student.service"
import { AlreadyRegistered, NotFoundError, UserNotSignedIn } from "../utils/errors"
import { validateDeleteSubject, validateNewStudent, validateSubject } from "./student.validator"

export const all_students =async (req:Request, resp:Response) => {
    try {
        const { role=null } = await getUser(req)
        if (role !== 'TEACHER' && role !== 'ADMIN') {
            return resp.status(403).json({ error: "You are not authorised" })
        }
        const students = await StudentService.allStudents()
        return resp.status(200).json({ success: true, students })
    } catch (error: any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Students not found" })
        }
        return resp.status(500).json({ error: "Internal server error" })
    }
}

export const new_students =async (req:Request, resp:Response) => {
    try {
        const { role=null } = await getUser(req)
        if (role !== 'ADMIN') {
            return resp.status(403).json({ error: "You are not authorised" })
        }
        const result = validateNewStudent(req.body)
        if (result.error) {
            return resp.status(400).json({ error: result.error.details})
        }
        const { id } = result.value
        const student = await StudentService.newStudents(id)
        return resp.status(200).json({ success: true, student })
    } catch (error:any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "User not found" })
        } else if (error instanceof AlreadyRegistered) {
            return resp.status(409).json({ error: "Student is already registered"})
        }
        return resp.status(500).json({ error: "Internal server error" })
    }
}

export const student_by_id =async (req:Request, resp:Response) => {
    try {
        const { role=null } = await getUser(req)
        if (role !== 'ADMIN' && role !== 'TEACHER') {
            return resp.status(403).json({ error: "You are not authorised" })
        }
        const result = validateNewStudent({ id: req.params.id });
        if (result.error) {
            return resp.status(400).json({ error: result.error.details})
        }
        const { id } = result.value
        const student = await StudentService.studentById(id)
        return resp.status(200).json({ success: true, student })
    } catch (error:any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Students not found" })
        }
        return resp.status(500).json({ error: "Internal server error" })
    }
}

export const add_subject =async (req:Request, resp:Response) => {
    try {
        const { userId=null, role=null } = await getUser(req)
        if (role !== 'STUDENT') {
            return resp.status(403).json({ error: "You are not authorised" })
        }
        const result = validateSubject(req.body)
        if (result.error) {
            return resp.status(400).json({ error: result.error.details})
        }
        const newSubject = await StudentService.addSubject(userId, result.value.subjectName)
        return resp.status(200).json({ success: true, newSubject })
    } catch (error:any) {
        console.log(error)
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Subject not found" })
        } else if (error instanceof AlreadyRegistered) {
            return resp.status(409).json({ error: "Subject is already registered"})
        }
        return resp.status(500).json({ error: "Internal server error" })
    }
}

export const del_subject =async (req:Request, resp:Response) => {
    try {
        const { userId=null, role=null } = await getUser(req)
        if (role !== 'ADMIN' && role !== 'TEACHER') {
            return resp.status(403).json({ error: "You are not authorised" })
        }
        const result = validateDeleteSubject(req.body)
        if (result.error) {
            return resp.status(400).json({ error: result.error.details})
        }
        const { studentId, subjectName } = result.value
        await StudentService.remSubject(studentId, subjectName)
        return resp.status(204).json()
    } catch (error: any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Students not found" })
        }
        return resp.status(500).json({ error: "Internal server error" })
    }
}

export const view_grades =async (req:Request, resp:Response) => {
    try {
        const { userId=null, role=null } = await getUser(req)
        if (role !== 'STUDENT') {
            return resp.status(403).json({ error: "You are not a student" })
        }
        const result = validateNewStudent(req.body)
        if (result.error) {
            return resp.status(400).json({ error: result.error.details})
        }
        const { id } = result.value
        const grades = await StudentService.seeGrades(id)
        return resp.status(200).json({ success: true, grades })
    } catch (error:any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(401).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Students not found" })
        }
        return resp.status(500).json({ error: "Internal server error"})
    }
}
