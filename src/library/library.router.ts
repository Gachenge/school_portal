import express from "express"
import * as LibraryController from "../library/library.controller"

export const libraryRouter = express.Router()

libraryRouter.get("/books", LibraryController.all_books)
libraryRouter.post("/books", LibraryController.new_book)
libraryRouter.get("/books/:id", LibraryController.book_by_id)
libraryRouter.patch("/books/:id", LibraryController.edit_book)
libraryRouter.delete("/books/:id", LibraryController.del_book)
libraryRouter.patch("/book/borrow", LibraryController.borrow_book)
libraryRouter.patch("/book/return", LibraryController.return_book)
libraryRouter.get("/members", LibraryController.all_members)
libraryRouter.post("/members", LibraryController.new_members)
libraryRouter.get("/members/:id", LibraryController.member_by_id)
libraryRouter.delete("/members/:id", LibraryController.delete_member)
