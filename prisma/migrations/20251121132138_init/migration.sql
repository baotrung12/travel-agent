-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tourCode" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "promotion" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "departurePoint" TEXT NOT NULL,
    "departureStart" TIMESTAMP(3) NOT NULL,
    "departureEnd" TIMESTAMP(3) NOT NULL,
    "duration" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourSchedule" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,

    CONSTRAINT "TourSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PastTour" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tourCode" TEXT NOT NULL,
    "departureStart" TIMESTAMP(3) NOT NULL,
    "departureEnd" TIMESTAMP(3) NOT NULL,
    "duration" TEXT NOT NULL,
    "price" INTEGER,
    "participants" INTEGER,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PastTour_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TourSchedule" ADD CONSTRAINT "TourSchedule_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
