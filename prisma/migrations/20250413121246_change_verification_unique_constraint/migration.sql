/*
  Warnings:

  - A unique constraint covering the columns `[email,type]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "VerificationToken_email_token_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_email_type_key" ON "VerificationToken"("email", "type");
