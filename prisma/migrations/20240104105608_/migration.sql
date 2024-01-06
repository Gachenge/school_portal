/*
  Warnings:

  - You are about to drop the column `studentProfileId` on the `SubjectGrade` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubjectGrade" DROP CONSTRAINT "SubjectGrade_studentProfileId_fkey";

-- AlterTable
ALTER TABLE "SubjectGrade" DROP COLUMN "studentProfileId",
ALTER COLUMN "studentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SubjectGrade" ADD CONSTRAINT "SubjectGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
