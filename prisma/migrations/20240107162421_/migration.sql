-- AddForeignKey
ALTER TABLE "BorrowedBooks" ADD CONSTRAINT "BorrowedBooks_booksId_fkey" FOREIGN KEY ("booksId") REFERENCES "Books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
