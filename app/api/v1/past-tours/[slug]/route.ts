import {prisma} from "@/app/prisma";
import {NextResponse} from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const tour = await prisma.pastTour.findFirst({
    where: {
      slug: slug,
      ready: true,
    },
    include: { pastSchedule: true },
  });

  if (!tour) {
    return NextResponse.json({ error: "Tour not found or not ready" }, { status: 404 });
  }

  return NextResponse.json(tour);
}