import {prisma} from "@/app/prisma";
import {NextResponse} from "next/server";

export async function GET() {
  const today = new Date();

  const pastTours = await prisma.pastTour.findMany({
    where: {
      departureEnd: {
        lt: today,
      },
      ready: true,
    },
    orderBy: { departureEnd: "desc" },
    include: { pastSchedule: true },
  });

  return NextResponse.json(pastTours);
}