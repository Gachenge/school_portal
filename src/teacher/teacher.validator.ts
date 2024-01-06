import Joi from "joi"

export const validateTeacher = (teacher: {id: string}) => {
    const teacherSchema = Joi.object({
        id: Joi.string().required()
    })
    return teacherSchema.validate(teacher)
}

export const validateTeacherSubject = (subject: {teacherId: string, subjectName: string}) => {
    const subjectSchema = Joi.object({
        teacherId: Joi.string().required(),
        subjectName: Joi.string().required()
    })
    return subjectSchema.validate(subject)
}

export const validateGrade = (grade: {subjectName: string, grade: number, studentId: string}) => {
    const gradeSchema = Joi.object({
        subjectName: Joi.string().required(),
        studentGrade: Joi.number().required(),
        studentId: Joi.string().guid({ version: 'uuidv4'}).required()
    })
    return gradeSchema.validate(grade)
}

export const validateRemoveGrade = (grades: {gradeId: string, teacherId: string}) => {
    const delSchema = Joi.object({
        gradeId: Joi.string().guid({ version: 'uuidv4' }).required(),
    })
    return delSchema.validate(grades)
}
