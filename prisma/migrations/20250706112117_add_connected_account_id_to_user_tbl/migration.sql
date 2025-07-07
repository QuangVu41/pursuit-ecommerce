/*
  Warnings:

  - A unique constraint covering the columns `[connectedAccountId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "connectedAccountId" TEXT,
ADD COLUMN     "stripeConnectedLinked" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "users_connectedAccountId_key" ON "users"("connectedAccountId");
