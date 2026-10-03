-- AlterTable
ALTER TABLE "Tour" DROP COLUMN IF EXISTS "departureEnd",
DROP COLUMN IF EXISTS "departureStart";

-- AlterTable
ALTER TABLE "TourSchedule" DROP COLUMN IF EXISTS "date";
