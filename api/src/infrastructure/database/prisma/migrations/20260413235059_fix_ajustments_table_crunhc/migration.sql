/*
  Warnings:

  - You are about to drop the column `docType` on the `Crunch` table. All the data in the column will be lost.
  - You are about to drop the column `docValue` on the `Crunch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Crunch" DROP COLUMN "docType",
DROP COLUMN "docValue",
ADD COLUMN     "document" TEXT;
