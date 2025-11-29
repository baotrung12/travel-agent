-- CreateEnum
CREATE TYPE "Category" AS ENUM ('EDUCATION', 'FAMILY', 'BEACH', 'HIKING');

-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'EDUCATION',
ADD COLUMN     "destination" TEXT;
