/*
  Warnings:

  - You are about to drop the column `reshreshToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "reshreshToken",
ADD COLUMN     "refreshToken" TEXT;
