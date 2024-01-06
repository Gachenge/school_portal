/*
  Warnings:

  - You are about to drop the column `grades` on the `Grades` table. All the data in the column will be lost.
  - You are about to drop the column `grades` on the `Subjects` table. All the data in the column will be lost.
  - Added the required column `subjectId` to the `Grades` table without a default value. This is not possible if the table is not empty.
  - Made the column `userProfileId` on table `Grades` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Grades" DROP CONSTRAINT "Grades_userProfileId_fkey";

-- AlterTable
ALTER TABLE "Grades" DROP COLUMN "grades",
ADD COLUMN     "grade" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "subjectId" TEXT NOT NULL,
ALTER COLUMN "userProfileId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Subjects" DROP COLUMN "grades";

-- AddForeignKey
ALTER TABLE "Grades" ADD CONSTRAINT "Grades_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grades" ADD CONSTRAINT "Grades_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
