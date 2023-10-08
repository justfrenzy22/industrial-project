/*
  Warnings:

  - You are about to drop the column `phone` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '';
