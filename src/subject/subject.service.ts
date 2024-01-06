import { db } from "../utils/db.server"
import { NotFoundError, AlreadyRegistered, UnexpectedError } from "../utils/errors"

export const allSubjects = async () => {
    try {
        const subjects = await db.subject.findMany();
        return subjects;
    } catch (error: any) {
        throw new UnexpectedError(error.message);
    }
};

export const createSubject =async (name:string) => {
    try {
        const existingSubject = await db.subject.findUnique({ where: { name }})
        if (existingSubject) {
            throw new AlreadyRegistered("Subject already registered")
        }
        const subject = await db.subject.create({
            data : {
                name
            }
        })
        return subject
    } catch (error: any) {
        throw new UnexpectedError(error.message)
    }
}

export const subjectById =async (id:string) => {
    try {
        const subject = await db.subject.findUnique({ where: { id }})
        if (!subject) {
            throw new NotFoundError("Subject not found")
        }
        return subject
    } catch (error: any) {
        throw error
    }
}

export const editSubject =async (id:string, subjectName: string) => {
    try {
        const existingSubject = await subjectById(id)
        const subject = await db.subject.update({
            where: { id },
            data: {
                name: subjectName
            }
        })
        return subject
    } catch (error: any) {
        throw error
    }
}

export const deleteSubject =async (id:string) => {
    try {
        const existingSubject = await subjectById(id)
        const subject = await db.subject.delete({ where: { id }})
        return subject
    } catch (error: any) {
        throw error
    }
}
