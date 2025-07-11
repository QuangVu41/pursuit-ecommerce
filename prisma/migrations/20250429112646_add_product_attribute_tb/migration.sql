/*
  Warnings:

  - The values [ADMIN,USER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "ProductAttributeType" AS ENUM ('color', 'size');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('admin', 'user');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';

-- CreateTable
CREATE TABLE "product_attributes" (
    "id" TEXT NOT NULL,
    "type" "ProductAttributeType" NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_attributes_pkey" PRIMARY KEY ("id")
);
