/*
  Warnings:

  - Changed the type of `type` on the `product_attributes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "product_attributes" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ProductAttributeType";

-- CreateIndex
CREATE UNIQUE INDEX "product_attributes_type_key" ON "product_attributes"("type");
