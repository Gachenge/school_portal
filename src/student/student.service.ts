import { db } from "../utils/db.server"
import { AlreadyRegistered, NotFoundError, UnexpectedError } from "../utils/errors"

export const allStudents =async () => {
    try {
        const students = await db.studentProfile.findMany()
        return students
    } catch (error:any) {
        throw new UnexpectedError(error.message)
    }
}

export const newStudents =async (id:string) => {
    try {
        const existingStudent = await db.studentProfile.findUnique({ where: { studentId: id }})
        if (existingStudent) {
            throw new AlreadyRegistered("Student already regisered")
        }
        const existingUser = await db.user.findUnique({ where: { id }})
        if (!existingUser) {
            throw new NotFoundError("User doesnt exist")
        }
        const newStudent = await db.studentProfile.create({
            data: {
                studentId: id
            }
        })
        const updateRole = await db.user.update({
            where: { id },
            data: {
                role: 'STUDENT'
            }
        })
        return newStudent
    } catch (error: any) {
        throw error
    }
}

export const studentById = async (id: string) => {
    try {
        const student = await db.studentProfile.findUnique({
            where: { studentId: id },
            include: { subjects: true, SubjectGrade: true },
        });

        if (!student) {
            throw new NotFoundError(`Student with ID ${id} does not exist`);
        }

        return student;
    } catch (error: any) {
        throw error;
    }
};

export const addSubject = async (studentId: string, subjectName: string) => {
    try {
        const existingStudent = await db.studentProfile.findUnique({
            where: { studentId },
            include: { subjects: true },
        });

        if (!existingStudent) {
            throw new NotFoundError(`Student with ID ${studentId} does not exist`);
        }

        const existingSubject = await db.subject.findUnique({ where: { name: subjectName } });
        if (!existingSubject) {
            throw new NotFoundError(`Subject with name ${subjectName} does not exist`);
        }

        await db.$transaction([
            db.subject.update({
                where: { name: subjectName },
                data: {
                    student: {
                        connect: { studentId: existingStudent.studentId }
                    }
                }
            }),

            db.studentProfile.update({
                where: { studentId },
                data: {
                    subjects: {
                        connect: { name: subjectName },
                    },
                },
            })
        ])
        const updatedStudentProfile = await studentById(studentId)

        return updatedStudentProfile;
    } catch (error) {
        throw error;
    }
};

export const remSubject = async (studentId: string, subjectName: string) => {
    try {
        const existingStudent = await db.studentProfile.findUnique({
            where: { studentId },
            include: { subjects: true },
        });
        
        if (!existingStudent) {
            throw new NotFoundError(`Student with ID ${studentId} does not exist`);
        }
        
        const enrolledSubject = existingStudent.subjects.find((subject) => subject.name === subjectName);
        
        if (!enrolledSubject) {
            throw new NotFoundError(`Student is not enrolled in subject ${subjectName}`);
        }
        

        await db.$transaction([
            db.subject.update({
                where: { name: subjectName },
                data: {
                    student: {
                        disconnect: { studentId }
                    }
                }
            }),

            db.studentProfile.update({
                where: { studentId },
                data: {
                    subjects: {
                        disconnect: { name: subjectName },
                    },
                },
            })
        ])

        const updatedStudentProfile = await studentById(studentId)

        return updatedStudentProfile;
    } catch (error) {
        throw error;
    }
};

export const seeGrades =async (id:string) => {
    try {
        const grades = await db.subjectGrade.findMany({
            where: { studentId: id }
        })
        return grades        
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta && error.meta.target?.includes('studentId')) {
            throw new NotFoundError(`Student with ID ${id} not found`);
        } else {
            throw new UnexpectedError("Internal server error");
        }
    }
}
