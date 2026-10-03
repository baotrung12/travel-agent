import { cache } from "react";
import { prisma } from "@/app/prisma";

// Direct DB queries for public pages (avoids an extra HTTP hop through our own API).
// Results are JSON-normalised so pages receive the same shape the API used to return.
const plain = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const getPublishedTours = cache(async () =>
  plain(await prisma.tour.findMany({
    where: { ready: true },
    include: { tourSchedule: true },
    orderBy: { createdAt: "desc" },
  }))
);

export const getPublishedTourBySlug = cache(async (slug: string) => {
  const tour = await prisma.tour.findFirst({
    where: { slug, ready: true },
    include: { tourSchedule: true },
  });
  return tour ? plain(tour) : null;
});

export const getPublishedPastTours = cache(async () =>
  plain(await prisma.pastTour.findMany({
    where: { departureEnd: { lt: new Date() }, ready: true },
    orderBy: { departureEnd: "desc" },
    include: { pastSchedule: true },
  }))
);

export const getPublishedPastTourBySlug = cache(async (slug: string) => {
  const tour = await prisma.pastTour.findFirst({
    where: { slug, ready: true },
    include: { pastSchedule: true },
  });
  return tour ? plain(tour) : null;
});
