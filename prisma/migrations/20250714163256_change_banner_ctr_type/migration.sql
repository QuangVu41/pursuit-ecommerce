/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `banners` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "banners_type_key" ON "banners"("type");
