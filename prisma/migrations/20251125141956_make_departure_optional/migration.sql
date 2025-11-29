-- AlterTable
ALTER TABLE "PastTour" ALTER COLUMN "departureStart" DROP NOT NULL,
ALTER COLUMN "departureEnd" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tour" ALTER COLUMN "departureStart" DROP NOT NULL,
ALTER COLUMN "departureEnd" DROP NOT NULL;
