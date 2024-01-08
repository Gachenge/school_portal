import * as dotenv from "dotenv";
import express from "express";
import cors from "cors"
import { oauthRouter } from "./oauth/oauth.router";
import { blogRouter } from "./blog/blog.router";
import cookieParser from 'cookie-parser';
import { userRouter } from "./users/users.routers";
import { commentRouter } from "./comment/comment.router";
import { subjectRouter } from "./subject/subject.router";
import { teacherRouter } from "./teacher/teacher.router";
import { studentRouter } from "./student/student.router";
import { libraryRouter } from "./library/library.router";


dotenv.config();

const PORT: number = parseInt(process.env.PORT as string, 10)

const app = express()

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/api/oauth", oauthRouter)
app.use("/api/blog", blogRouter)
app.use("/api/users", userRouter)
app.use("/api/post", commentRouter)
app.use("/api/subjects", subjectRouter)
app.use("/api/teachers", teacherRouter)
app.use("/api/students", studentRouter)
app.use("/api/library", libraryRouter)


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
