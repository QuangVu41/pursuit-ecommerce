/*
  Warnings:

  - Made the column `altText` on table `product_images` required. This step will fail if there are existing NULL values in that column.
  - Made the column `altText` on table `product_variants` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "product_images" ALTER COLUMN "altText" SET NOT NULL;

-- AlterTable
ALTER TABLE "product_variants" ALTER COLUMN "altText" SET NOT NULL;
