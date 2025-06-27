/*
  Warnings:

  - Made the column `altText` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `categories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "altText" SET NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL;
