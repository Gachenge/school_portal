/*
  Warnings:

  - You are about to drop the column `memberId` on the `Books` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Books" DROP CONSTRAINT "Books_memberId_fkey";

-- DropForeignKey
ALTER TABLE "BorrowedBooks" DROP CONSTRAINT "BorrowedBooks_booksId_fkey";

-- AlterTable
ALTER TABLE "Books" DROP COLUMN "memberId";
