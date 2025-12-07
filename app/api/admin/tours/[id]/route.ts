import {NextRequest, NextResponse} from "next/server";
import {supabase} from "@/app/services/supabaseClient";
import {prisma} from "@/app/prisma";
import {Category} from "@/app/generated/prisma/enums";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const tour = await prisma.tour.findUnique({
    where: { id: id },
    include: { tourSchedule: true },
  });

  if (!tour) {
    return NextResponse.json({ error: "Tour not found" }, { status: 404 });
  }

  return NextResponse.json(tour);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const body = await req.json()

  // Parse fields directly from JSON payload
  const {
    title,
    slug,
    tourCode,
    departureStart,
    departureEnd,
    duration,
    price,
    destination,
    category,
    tourSchedule,
    tourImages,
  } = body

  console.log("tourSchedule:", tourSchedule)

  const scheduleArray = Array.isArray(tourSchedule)
    ? tourSchedule
    : JSON.parse(tourSchedule || "[]")

  // Update tour in DB
  const updatedTour = await prisma.tour.update({
    where: { id },
    data: {
      title,
      slug,
      tourCode,
      departureStart: new Date(departureStart),
      departureEnd: new Date(departureEnd),
      duration,
      price: Number(price),
      destination,
      category: category as Category,
      imageUrls: tourImages,
      tourSchedule: {
        deleteMany: {}, // remove old schedule
        create: scheduleArray.map((item: any) => ({
          date: new Date(item.date),
          title: item.title,
          description: item.description,
        })),
      },
    },
  })

  return NextResponse.json(updatedTour)
}
