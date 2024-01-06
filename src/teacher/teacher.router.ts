import express from "express";
import * as TeacherController from "../teacher/teacher.controller"

export const teacherRouter = express.Router()

teacherRouter.get("/", TeacherController.all_teachers)
teacherRouter.post("/", TeacherController.new_teachers)
teacherRouter.get("/:id", TeacherController.get_teacher_by_id)
teacherRouter.post("/subjects", TeacherController.add_subjects)
teacherRouter.patch("/subjects", TeacherController.rem_subject)
teacherRouter.post("/grade", TeacherController.add_grade)
teacherRouter.patch("/grade", TeacherController.del_grade)
