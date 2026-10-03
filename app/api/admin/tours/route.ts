import { NextResponse } from "next/server";
import {revalidateTourPages} from "@/lib/revalidatePublic";
import {prisma} from "@/app/prisma";
import {sanitizeRichText} from "@/lib/sanitize";
import {supabase} from "@/app/services/supabaseClient";
import {Category} from "@/app/generated/prisma/enums";

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
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


export async function POST(req: Request) {
  const body = await req.json()
  const {
    title,
    slug,
    duration,
    price,
    tourCode,
    summary,
    promotion,
    departurePoint,
    destination,
    category,
    tourSchedule,
    images,
  } = body

  try {
    const scheduleArray = Array.isArray(tourSchedule)
      ? tourSchedule
      : JSON.parse(tourSchedule || "[]")

    console.log("[DATA] title:", scheduleArray, "slug:", slug, "tourCode:", tourCode, "duration:", duration, "price:", price, "summary:", summary, "promotion:", promotion, "departurePoint:", departurePoint, "destination:", destination, "category:", category, "images:", images)

    const tour = await prisma.tour.create({
      data: {
        title,
        slug,
        duration,
        price: Number(price),
        tourCode,
        summary,
        promotion,
        departurePoint,
        destination,
        category: category as Category,
        imageUrls: images,
        tourSchedule: {
          create: scheduleArray.map((item: any) => ({
            title: item.title,
            description: sanitizeRichText(item.description),
          })),
        },
      },
    });

    revalidateTourPages();
    return NextResponse.json(tour);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create tour" }, { status: 500 });
  }
}
