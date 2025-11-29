import {prisma} from "@/app/prisma";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      where: {
        ready: true,
      },
      include: {
        tourSchedule: true, // 👈 include schedule if needed
      },
      orderBy: {
        createdAt: "desc", // newest first
      },
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}