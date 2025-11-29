/*
  Warnings:

  - The values [EDUCATION,FAMILY,BEACH,CULTURE] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('STUDENT', 'TEACHER');
ALTER TABLE "public"."PastTour" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "public"."Tour" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Tour" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TABLE "PastTour" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
ALTER TABLE "PastTour" ALTER COLUMN "category" SET DEFAULT 'STUDENT';
ALTER TABLE "Tour" ALTER COLUMN "category" SET DEFAULT 'STUDENT';
COMMIT;

-- AlterTable
ALTER TABLE "PastTour" ALTER COLUMN "category" SET DEFAULT 'STUDENT';

-- AlterTable
ALTER TABLE "Tour" ALTER COLUMN "category" SET DEFAULT 'STUDENT';
