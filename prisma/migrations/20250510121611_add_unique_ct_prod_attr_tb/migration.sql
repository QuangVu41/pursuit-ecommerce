/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `product_attributes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "product_attributes_name_userId_key" ON "product_attributes"("name", "userId");
