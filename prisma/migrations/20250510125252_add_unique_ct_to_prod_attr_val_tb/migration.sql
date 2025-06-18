/*
  Warnings:

  - A unique constraint covering the columns `[name,attributeId]` on the table `product_attribute_values` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "product_attribute_values_name_attributeId_key" ON "product_attribute_values"("name", "attributeId");
