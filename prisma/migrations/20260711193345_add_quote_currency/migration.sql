-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'USD', 'XOF');

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'XOF';
