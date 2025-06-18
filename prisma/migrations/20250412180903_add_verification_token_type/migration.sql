/*
  Warnings:

  - A unique constraint covering the columns `[email,token,type]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VerificationTokenType" AS ENUM ('EMAIL', 'PASSWORDRESET', 'TWOFACTOR');

-- DropIndex
DROP INDEX "VerificationToken_email_token_key";

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN     "type" "VerificationTokenType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_email_token_type_key" ON "VerificationToken"("email", "token", "type");
