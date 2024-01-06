import express from "express";
import * as SubjectController from "../subject/subject.controller"

export const subjectRouter = express.Router()

subjectRouter.get("/", SubjectController.all_subjects)
subjectRouter.post("/", SubjectController.create_subject)
subjectRouter.get("/:id", SubjectController.get_subject_by_id)
subjectRouter.patch("/:id", SubjectController.edit_subject)
subjectRouter.delete("/:id", SubjectController.delete_subject)
