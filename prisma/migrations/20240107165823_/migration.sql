/*
  Warnings:

  - You are about to drop the column `createdAt` on the `BorrowedBooks` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `BorrowedBooks` table. All the data in the column will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BorrowedBooks" DROP CONSTRAINT "BorrowedBooks_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_userId_fkey";

-- AlterTable
ALTER TABLE "BorrowedBooks" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "overdueBooksId" TEXT;

-- DropTable
DROP TABLE "Member";

-- CreateTable
CREATE TABLE "MemberProfile" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "MemberProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OverdueBooks" (
    "id" TEXT NOT NULL,

    CONSTRAINT "OverdueBooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MemberProfileToOverdueBooks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberProfile_memberId_key" ON "MemberProfile"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "_MemberProfileToOverdueBooks_AB_unique" ON "_MemberProfileToOverdueBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_MemberProfileToOverdueBooks_B_index" ON "_MemberProfileToOverdueBooks"("B");

-- AddForeignKey
ALTER TABLE "MemberProfile" ADD CONSTRAINT "MemberProfile_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowedBooks" ADD CONSTRAINT "BorrowedBooks_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowedBooks" ADD CONSTRAINT "BorrowedBooks_overdueBooksId_fkey" FOREIGN KEY ("overdueBooksId") REFERENCES "OverdueBooks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberProfileToOverdueBooks" ADD CONSTRAINT "_MemberProfileToOverdueBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "MemberProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberProfileToOverdueBooks" ADD CONSTRAINT "_MemberProfileToOverdueBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "OverdueBooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
