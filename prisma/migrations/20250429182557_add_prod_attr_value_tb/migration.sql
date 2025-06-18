/*
  Warnings:

  - You are about to drop the column `value` on the `product_attributes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `product_attributes` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `name` on the `product_attributes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "product_attributes_name_value_key";

-- AlterTable
ALTER TABLE "product_attributes" DROP COLUMN "value",
DROP COLUMN "name",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ProductAttributeType";

-- CreateTable
CREATE TABLE "product_attribute_values" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_attribute_values_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_attribute_values_name_key" ON "product_attribute_values"("name");

-- CreateIndex
CREATE UNIQUE INDEX "product_attributes_name_key" ON "product_attributes"("name");

-- AddForeignKey
ALTER TABLE "product_attribute_values" ADD CONSTRAINT "product_attribute_values_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "product_attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
