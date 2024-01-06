import * as StudentController from "../student/student.controller"
import express from 'express'

export const studentRouter = express.Router()

studentRouter.get("/", StudentController.all_students)
studentRouter.post("/", StudentController.new_students)
studentRouter.get("/:id", StudentController.student_by_id)
studentRouter.post("/subject", StudentController.add_subject)
studentRouter.patch("/subject", StudentController.del_subject)
studentRouter.get("/grades", StudentController.view_grades)
