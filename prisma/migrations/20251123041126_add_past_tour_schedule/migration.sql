-- AlterTable
ALTER TABLE "PastTour" ADD COLUMN     "tourImages" TEXT[];

-- CreateTable
CREATE TABLE "PastTourSchedule" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrls" TEXT[],
    "pastTourId" TEXT NOT NULL,

    CONSTRAINT "PastTourSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PastTourSchedule" ADD CONSTRAINT "PastTourSchedule_pastTourId_fkey" FOREIGN KEY ("pastTourId") REFERENCES "PastTour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
