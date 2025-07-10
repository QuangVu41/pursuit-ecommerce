/*
  Warnings:

  - You are about to drop the column `platformFee` on the `orders` table. All the data in the column will be lost.
  - Added the required column `platformFee` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "platformFee" INTEGER NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "platformFee";
