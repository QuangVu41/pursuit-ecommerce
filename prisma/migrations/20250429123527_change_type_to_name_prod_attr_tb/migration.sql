/*
  Warnings:

  - You are about to drop the column `type` on the `product_attributes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `product_attributes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `product_attributes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "product_attributes_type_key";

-- AlterTable
ALTER TABLE "product_attributes" DROP COLUMN "type",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_attributes_name_key" ON "product_attributes"("name");
