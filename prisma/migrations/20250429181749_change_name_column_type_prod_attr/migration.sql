/*
  Warnings:

  - The values [EMAIL,PASSWORDRESET,TWOFACTOR] on the enum `VerificationTokenType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[name,value]` on the table `product_attributes` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `name` on the `product_attributes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductAttributeType" AS ENUM ('color', 'size', 'weight');

-- AlterEnum
BEGIN;
CREATE TYPE "VerificationTokenType_new" AS ENUM ('email', 'passwordReset', 'twoFactor');
ALTER TABLE "verification_tokens" ALTER COLUMN "type" TYPE "VerificationTokenType_new" USING ("type"::text::"VerificationTokenType_new");
ALTER TYPE "VerificationTokenType" RENAME TO "VerificationTokenType_old";
ALTER TYPE "VerificationTokenType_new" RENAME TO "VerificationTokenType";
DROP TYPE "VerificationTokenType_old";
COMMIT;

-- DropIndex
DROP INDEX "product_attributes_name_key";

-- AlterTable
ALTER TABLE "product_attributes" DROP COLUMN "name",
ADD COLUMN     "name" "ProductAttributeType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_attributes_name_value_key" ON "product_attributes"("name", "value");
