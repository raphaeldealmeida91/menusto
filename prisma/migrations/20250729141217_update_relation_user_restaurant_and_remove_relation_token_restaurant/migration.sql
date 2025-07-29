/*
  Warnings:

  - You are about to drop the column `restaurantId` on the `AccountCreationToken` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccountCreationToken" DROP CONSTRAINT "AccountCreationToken_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_restaurantId_fkey";

-- DropIndex
DROP INDEX "AccountCreationToken_restaurantId_key";

-- DropIndex
DROP INDEX "User_restaurantId_key";

-- AlterTable
ALTER TABLE "AccountCreationToken" DROP COLUMN "restaurantId";

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "restaurantId";

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
