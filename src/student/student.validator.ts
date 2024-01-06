import Joi from "joi"

export const validateNewStudent = (student: { id: string }) => {
    const studentSchema = Joi.object({
        id: Joi.string().guid({ version: 'uuidv4' }).required()
    });
    return studentSchema.validate(student);
};

export const validateSubject = (subjectName: string) => {
    const subjectSchema = Joi.object({
        subjectName: Joi.string().required()
    })
    return subjectSchema.validate(subjectName)
}

export const validateDeleteSubject = (student: {studentId: string, subjectName: string}) => {
    const studentSchema = Joi.object({
        studentId: Joi.string().guid({ version: 'uuidv4' }).required(),
        subjectName: Joi.string().required()
    })
    return studentSchema.validate(student)
}
