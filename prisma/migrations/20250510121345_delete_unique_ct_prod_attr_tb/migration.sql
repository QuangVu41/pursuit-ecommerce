/*
  Warnings:

  - Made the column `userId` on table `product_attributes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "product_attribute_values_name_key";

-- DropIndex
DROP INDEX "product_attributes_name_key";

-- AlterTable
ALTER TABLE "product_attributes" ALTER COLUMN "userId" SET NOT NULL;
