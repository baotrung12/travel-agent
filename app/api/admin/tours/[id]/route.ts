import {NextRequest, NextResponse} from "next/server";
import {revalidateTourPages} from "@/lib/revalidatePublic";
import {supabase} from "@/app/services/supabaseClient";
import {prisma} from "@/app/prisma";
import {sanitizeRichText} from "@/lib/sanitize";
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
    summary,
    promotion,
    departurePoint,
    destination,
    category,
    tourSchedule,
    tourImages,
  } = body

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
      summary,
      promotion,
      departurePoint,
      destination,
      category: category as Category,
      imageUrls: tourImages,
      tourSchedule: {
        deleteMany: {},
        create: scheduleArray.map((item: any) => ({
          title: item.title,
          description: sanitizeRichText(item.description),
        })),
      },
    },
  })

  revalidateTourPages();
  return NextResponse.json(updatedTour)
}


export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params

  try {
    await prisma.$transaction([
      prisma.tourSchedule.deleteMany({ where: { tourId: id } }),
      prisma.tour.delete({ where: { id } }),
    ])
    revalidateTourPages();
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting tour:", error)
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 })
  }
}
