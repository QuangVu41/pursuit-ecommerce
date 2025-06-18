/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `product_attributes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "product_attributes_type_key" ON "product_attributes"("type");
