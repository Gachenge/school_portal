import { Subject, TeacherProfile } from "@prisma/client";
import { db } from "../utils/db.server"
import { AlreadyRegistered, ForbiddenError, NotFoundError, UnexpectedError } from "../utils/errors"

export const allTeachers =async () => {
    try {
        const teachers = await db.teacherProfile.findMany()
        return teachers
    } catch (error: any) {
        throw new UnexpectedError(error.message)
    }
}

export const newTeacher =async (id:string) => {
    try {
        const existingTeacher = await db.teacherProfile.findUnique({ where: { teacherId: id }})
        if (existingTeacher) {
            throw new AlreadyRegistered("Teacher already regisered")
        }
        const existingUser = await db.user.findUnique({ where: { id }})
        if (!existingUser) {
            throw new NotFoundError("User doesnt exist")
        }
        const newTeacher = await db.teacherProfile.create({
            data: {
                teacherId: id
            }
        })
        const updateRole = await db.user.update({
            where: { id },
            data: {
                role: 'TEACHER'
            }
        })
        return newTeacher
    } catch (error: any) {
        throw error
    }
}

export const teacherById = async (id: string) => {
    try {
        const teacher = await db.teacherProfile.findUnique({
            where: { teacherId: id },
            include: { subjects: true },
        });

        if (!teacher) {
            throw new NotFoundError(`Teacher with ID ${id} does not exist`);
        }

        return teacher;
    } catch (error: any) {
        throw error;
    }
};

export const addSubject = async (teacherId: string, subjectName: string) => {
    try {
        // Check if the teacher exists
        const existingTeacher = await teacherById(teacherId);
        if (!existingTeacher) {
            throw new NotFoundError(`Teacher with ID ${teacherId} does not exist`);
        }

        // Check if the subject exists
        const existingSubject = await db.subject.findUnique({ where: { name: subjectName } });
        if (!existingSubject) {
            throw new NotFoundError(`Subject with name ${subjectName} does not exist`);
        }

        // Update the subject with the teacherId
        await db.$transaction([
            db.subject.update({
                where: { name: subjectName },
                data: {
                    teacher: {
                        connect: { teacherId: existingTeacher.teacherId }
                    }
                },
            }),
            db.teacherProfile.update({
                where: { teacherId: existingTeacher.teacherId },
                data: {
                    subjects: {
                        connect: { name: subjectName },
                    },
                },
            }),
        ]);

        // Update the teacher profile with the new subject
        const updatedTeacherProfile = await teacherById(teacherId);

        return updatedTeacherProfile;
    } catch (error: any) {
        throw error;
    }
};

export const remSubject =async (teacherId:string, subjectName:string) => {
    try {
        // Check if the teacher exists
        const existingTeacher = await teacherById(teacherId);
        if (!existingTeacher) {
            throw new NotFoundError("Teacher does not exist");
        }

        // Check if the subject exists
        const existingSubject = await db.subject.findUnique({ where: { name: subjectName } });
        if (!existingSubject) {
            throw new NotFoundError("Subject does not exist");
        }

        // remove teacherId from the subject
        await db.$transaction([
            db.subject.update({
                where: { name: subjectName },
                data: {
                    teacher: {
                        disconnect: { teacherId }
                    }
                }
            }),

            db.teacherProfile.update({
                where: { teacherId },
                data: {
                    subjects: {
                        disconnect: { name: subjectName },
                    },
                },
            })
        ])
        const updatedTeacherProfile = await teacherById(teacherId)

        return updatedTeacherProfile;
    } catch (error: any) {
        throw error;
    }
}

export const gradeSubject = async (teacherId: string, subjectName: string, studentGrade: number, studentId: string) => {
    try {
        // Check if the subject exists
        const existingSubject = await db.subject.findUnique({ where: { name: subjectName } });
        if (!existingSubject) {
            throw new NotFoundError("Subject does not exist");
        }

        // Check if the teacher teaches the subject
        const teacher = await db.teacherProfile.findUnique({
            where: { teacherId },
            include: { subjects: true },
        });

        const student = await db.studentProfile.findUnique({
            where: { studentId },
            include: { subjects: true }
        });

        if (!student) {
            throw new NotFoundError("Student not found");
        }

        if (teacher && teacher.subjects.some(subject => subject.name === existingSubject.name)) {
            // Create the subjectGrade
            const grade = await db.subjectGrade.create({
                data: {
                    subjectId: existingSubject.id,
                    grade: studentGrade,
                    studentId: student.studentId,
                },
            });

            // Update the student profile
            await db.studentProfile.update({
                where: { studentId: studentId },
                data: {
                    SubjectGrade: {
                        connect: { id: grade.id },
                    },
                },
            });

            return grade;
        } else {
            throw new ForbiddenError("You are not authorized");
        }
    } catch (error: any) {
        throw error;
    }
};

export const deleteGrade = async (gradeId: string, teacherId: string) => {
    try {
        // Check if the grade exists
        const existingGrade = await db.subjectGrade.findUnique({ where: { id: gradeId } });
        if (!existingGrade) {
            throw new NotFoundError("Grade does not exist");
        }

        // Check if the teacher is authorized to delete the grade
        const teachingSubject = await db.teacherProfile.findUnique({
            where: { teacherId },
        }) as TeacherProfile & { subjects: Subject[] };

        const isAuthorized = teachingSubject &&
            teachingSubject.subjects.some(subject => subject.id === existingGrade.subjectId);

        if (!isAuthorized) {
            throw new ForbiddenError("Teacher is not authorized to delete this grade");
        }

        // Update the StudentProfile to disconnect the grade
        await db.studentProfile.update({
            where: { studentId: existingGrade.studentId || undefined },
            data: {
                SubjectGrade: {
                    disconnect: { id: gradeId }
                }
            }
        });

        // Delete the grade
        await db.subjectGrade.delete({
            where: { id: gradeId }
        });

        return { message: "Grade deleted successfully" };
    } catch (error: any) {
        throw error;
    }
};
