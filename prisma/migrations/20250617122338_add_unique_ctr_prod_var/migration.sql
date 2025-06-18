/*
  Warnings:

  - A unique constraint covering the columns `[productId,firstAttrId,secondAttrId]` on the table `product_variants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "product_variants_firstAttrId_secondAttrId_key";

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_productId_firstAttrId_secondAttrId_key" ON "product_variants"("productId", "firstAttrId", "secondAttrId");
