-- AlterTable
ALTER TABLE "PastTour" ADD COLUMN     "ready" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "ready" BOOLEAN NOT NULL DEFAULT false;
