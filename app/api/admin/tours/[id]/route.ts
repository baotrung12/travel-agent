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
      duration,
      price: Number(price),
      destination,
      category: category as Category,
      imageUrls: tourImages,
      tourSchedule: {
        deleteMany: {},
        create: scheduleArray.map((item: any) => ({
          title: item.title,
          description: item.description,
        })),
      },
    },
  })

  return NextResponse.json(updatedTour)
}
