import { NextResponse } from "next/server";
import {prisma} from "@/app/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const tour = await prisma.tour.findFirst({
    where: {
      slug: slug,
      ready: true,
    },
    include: { tourSchedule: true },
  });

  if (!tour) {
    return NextResponse.json({ error: "Tour not found or not ready" }, { status: 404 });
  }

  return NextResponse.json(tour);
}
