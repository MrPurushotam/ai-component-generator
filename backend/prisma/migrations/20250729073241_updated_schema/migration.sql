/*
  Warnings:

  - You are about to drop the column `sender` on the `Message` table. All the data in the column will be lost.
  - Added the required column `role` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'assistant');

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "sender",
ADD COLUMN     "imageData" TEXT DEFAULT '',
ADD COLUMN     "role" "Role" NOT NULL;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "framework" TEXT DEFAULT 'reactjs',
ADD COLUMN     "modelUsed" TEXT DEFAULT 'gemini-2.5-flash',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "CodeSnapshot" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeSnapshot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CodeSnapshot" ADD CONSTRAINT "CodeSnapshot_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
