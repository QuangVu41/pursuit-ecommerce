/*
  Warnings:

  - You are about to drop the column `firstAttributeValueId` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `secondAttributeValueId` on the `product_variants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[firstAttrId,secondAttrId]` on the table `product_variants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_firstAttributeValueId_fkey";

-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_secondAttributeValueId_fkey";

-- DropIndex
DROP INDEX "product_variants_firstAttributeValueId_secondAttributeValue_key";

-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "firstAttributeValueId",
DROP COLUMN "secondAttributeValueId",
ADD COLUMN     "firstAttrId" TEXT,
ADD COLUMN     "secondAttrId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_firstAttrId_secondAttrId_key" ON "product_variants"("firstAttrId", "secondAttrId");

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_firstAttrId_fkey" FOREIGN KEY ("firstAttrId") REFERENCES "product_attribute_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_secondAttrId_fkey" FOREIGN KEY ("secondAttrId") REFERENCES "product_attribute_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;
