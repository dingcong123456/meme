/*
  Warnings:

  - Added the required column `amount` to the `price_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volume` to the `price_statistics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "price_history" ADD COLUMN     "amount" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "price_statistics" ADD COLUMN     "volume" TEXT NOT NULL;
