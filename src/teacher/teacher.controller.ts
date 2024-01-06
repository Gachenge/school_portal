import { Request, Response } from "express"
import * as TeacherService from "../teacher/teacher.service"
import { getUser } from "../utils/helpers"
import { AlreadyRegistered, ForbiddenError, NotFoundError, UserNotSignedIn } from "../utils/errors";
import { validateGrade, validateRemoveGrade, validateTeacher, validateTeacherSubject } from "./teacher.validator";

export const all_teachers =async (req:Request, resp:Response) => {
    try {
        const { role } = await getUser(req) ?? { role: null };
        if (role !== 'ADMIN' && role !== 'TEACHER') {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        const teachers = await TeacherService.allTeachers()
        return resp.status(200).json({ success: true, teachers})
    } catch(error: any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(403).json({ error: "You are not signed in" })
        } else if (error instanceof NotFoundError) {
            return resp.status(401).json({ error: "User not found" })
        } else if (error.status) {
            return resp.status(error.status).json({ error: error.message })
        }
        return resp.status(500).json({ error: error.message })
    }
}

export const new_teachers =async (req:Request, resp: Response) => {
    try {
        const { role } = await getUser(req) ?? { role: null };
        if (role !== 'ADMIN') {
            return resp.status(403).json({ error: "You are not authorised"})
        }

        const result = validateTeacher(req.body)
        if (result.error) {
            return resp.status(400).json({ error: result.error.details})
        }
        
        const teacher = await TeacherService.newTeacher(result.value.id)
        return resp.status(200).json({ success: true, teacher })
    } catch (error: any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(403).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Teacher not found"})
        } else if (error instanceof AlreadyRegistered) {
            return resp.status(409).json({ error: "Teacher already registered" })
        }
        return resp.status(500).json({ error: "Internal server error"})
    }
}

export const get_teacher_by_id =async (req:Request, resp:Response) => {
    const id = req.params.id
    try {
        const { role } = await getUser(req) ?? { role: null };
        if (role !== 'ADMIN' && role !== 'TEACHER') {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        const teacher = await TeacherService.teacherById(id)
        if (!teacher) {
            throw new NotFoundError("Teacher not found")
        }
        return resp.status(200).json({ success: true, teacher })
    } catch (error: any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(403).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Teacher not found"})
        }
        return resp.status(500).json({ error: "Internal server error"})
    }
}

export const add_subjects =async (req:Request, resp:Response) => {
    try {
        const { role } = await getUser(req) ?? { role: null };
        if (role !== 'ADMIN') {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        const result = validateTeacherSubject(req.body)
        if (result.error) {
           return resp.status(400).json({ error: result.error.details})
        }
        const { teacherId, subjectName } = result.value
        const subject = await TeacherService.addSubject(teacherId, subjectName)
        return resp.status(200).json({ success: true, subject })
    } catch (error: any) {
        console.log(error.message)
        if (error instanceof UserNotSignedIn) {
            return resp.status(403).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Teacher or subject not found"})
        }
        return resp.status(500).json({ error: "Internal server error"})
    }
}

export const rem_subject =async (req:Request, resp:Response) => {
    try {
        const { role } = await getUser(req) ?? { role: null };
        if (role !== 'ADMIN') {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        const result = validateTeacherSubject(req.body)
        if (result.error) {
           return resp.status(400).json({ error: result.error.details})
        }
        const { teacherId, subjectName } = result.value
        const subject = await TeacherService.remSubject(teacherId, subjectName)
        return resp.status(200).json({ success: true, subject })
    } catch (error: any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(403).json({ error: "You are not signed in"})
        } else if (error instanceof NotFoundError) {
            return resp.status(404).json({ error: "Teacher or subject not found"})
        }
        return resp.status(500).json({ error: "Internal server error"})
    }
}

export const add_grade =async (req:Request, resp:Response) => {
    try {
        const { userId, role } = await getUser(req) ?? { userId: null, role: null };
        if (role !== 'TEACHER' && role !== 'ADMIN') {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        const result = validateGrade(req.body)
        if (result.error) {
            return resp.status(400).json({ error: result.error.details})
        }
        const { subjectName, studentGrade, studentId } = result.value
        const gradeStudent = await TeacherService.gradeSubject(userId, subjectName, studentGrade, studentId)
        return resp.status(200).json({ success: true, gradeStudent })
    } catch (error: any) {
        console.log(error)
        if (error instanceof UserNotSignedIn) {
            return resp.status(403).json({ error: "You are not signed in" })
        } else if (error instanceof NotFoundError) {
            return resp.status(401).json({ error: "Student or subject not found" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "You are not authorised" });
        } else if (error.status) {
            return resp.status(error.status).json({ error: error.message })
        }
        return resp.status(500).json({ error: error.message })
    }
}

export const del_grade =async (req:Request, resp:Response) => {
    try {
        const { userId, role } = await getUser(req) ?? { userId: null, role: null };
        if (role !== 'TEACHER' && role !== 'ADMIN') {
            return resp.status(403).json({ error: "You are not authorised"})
        }
        const result = validateRemoveGrade(req.body)
        if (result.error) {
            return resp.status(400).json({ error: result.error.details})
        }
        const { gradeId } = result.value
        const removeGrade = await TeacherService.deleteGrade(gradeId, userId)
        return resp.status(204).json()
    } catch (error: any) {
        if (error instanceof UserNotSignedIn) {
            return resp.status(403).json({ error: "You are not signed in" })
        } else if (error instanceof NotFoundError) {
            return resp.status(401).json({ error: "Student or subject not found" })
        } else if (error instanceof ForbiddenError) {
            return resp.status(403).json({ error: "You are not authorised" });
        } else if (error.status) {
            return resp.status(error.status).json({ error: error.message })
        }
        return resp.status(500).json({ error: error.message })
    }
}
