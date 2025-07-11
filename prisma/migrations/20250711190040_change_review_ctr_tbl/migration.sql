/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "reviews_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_productId_key" ON "reviews"("userId", "productId");
