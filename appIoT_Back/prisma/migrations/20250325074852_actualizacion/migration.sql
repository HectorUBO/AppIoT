/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Plot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `Plot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `plot` ADD COLUMN `externalId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Plot_externalId_key` ON `Plot`(`externalId`);
