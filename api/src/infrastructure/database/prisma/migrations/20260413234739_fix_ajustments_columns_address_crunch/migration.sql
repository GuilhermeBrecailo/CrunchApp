/*
  Warnings:

  - You are about to drop the column `district` on the `Crunch` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Crunch` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Crunch` table. All the data in the column will be lost.
  - Added the required column `localZipCode` to the `Crunch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `road` to the `Crunch` table without a default value. This is not possible if the table is not empty.
  - Made the column `city` on table `Crunch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `Crunch` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Crunch" DROP COLUMN "district",
DROP COLUMN "street",
DROP COLUMN "zipCode",
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "localZipCode" TEXT NOT NULL,
ADD COLUMN     "road" TEXT NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL;
