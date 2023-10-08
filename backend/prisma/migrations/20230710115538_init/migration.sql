/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Kontragent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Surovini` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `secondLevel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `thirdLevel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Kontragent_name_key" ON "Kontragent"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Surovini_name_key" ON "Surovini"("name");

-- CreateIndex
CREATE UNIQUE INDEX "secondLevel_name_key" ON "secondLevel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "thirdLevel_name_key" ON "thirdLevel"("name");
