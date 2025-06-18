/*
  Warnings:

  - Made the column `firstAttrId` on table `product_variants` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "product_variants" ALTER COLUMN "firstAttrId" SET NOT NULL;
