import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/app/prisma";
import {supabase} from "@/app/services/supabaseClient";
import {Category} from "@/app/generated/prisma/enums";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const tour = await prisma.pastTour.findUnique({
      where: { id: id },
      include: { pastSchedule: true }, // lấy cả lịch trình
    });

    if (!tour) {
      return NextResponse.json({ error: "Không tìm thấy tour" }, { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const body = await req.json()

  const {
    title,
    tourCode,
    departureStart,
    departureEnd,
    duration,
    price,
    participants,
    feedback,
    destination,
    category,
    tourImages,   // array of URLs (already uploaded client-side)
    pastSchedule, // array of { id?, date, title, description, imageUrls }
  } = body

  // Update PastTour
  const updatedPastTour = await prisma.pastTour.update({
    where: { id },
    data: {
      title,
      tourCode,
      departureStart: new Date(departureStart),
      departureEnd: new Date(departureEnd),
      duration,
      price: Number(price),
      participants: participants ? Number(participants) : null,
      feedback,
      destination,
      category: category as Category,
      tourImages, // ✅ directly save URLs
      pastSchedule: {
        upsert: pastSchedule.map((day: any) => ({
          where: { id: day.id ?? "" }, // update if id exists
          update: {
            date: new Date(day.date),
            title: day.title,
            description: day.description,
            imageUrls: day.imageUrls, // ✅ already URLs
          },
          create: {
            date: new Date(day.date),
            title: day.title,
            description: day.description,
            imageUrls: day.imageUrls,
          },
        })),
      },
    },
    include: { pastSchedule: true },
  })

  return NextResponse.json(updatedPastTour)
}
