import { NextResponse } from "next/server";
import {prisma} from "@/app/prisma";
import {supabase} from "@/app/services/supabaseClient";
import {Category} from "@/app/generated/prisma/enums";

export async function GET() {
  const today = new Date();

  const pastTours = await prisma.pastTour.findMany({
    where: {
      departureEnd: {
        lt: today,
      },
    },
    orderBy: { departureEnd: "desc" },
    include: { pastSchedule: true },
  });

  return NextResponse.json(pastTours);
}

export async function POST(req: Request) {
  const body = await req.json()

  const {
    title,
    slug,
    tourCode,
    departureStart,
    departureEnd,
    duration,
    price,
    participants,
    feedback,
    category,
    tourImages,
    pastSchedule,
  } = body

  const newPastTour = await prisma.pastTour.create({
    data: {
      title,
      slug,
      tourCode,
      departureStart: new Date(departureStart),
      departureEnd: new Date(departureEnd),
      duration,
      price: Number(price),
      participants: Number(participants) ?? null,
      feedback,
      tourImages,
      category: category as Category,
      pastSchedule: {
        create: pastSchedule.map((day: any) => ({
          date: new Date(day.date),
          title: day.title,
          description: day.description,
          imageUrls: day.imageUrls, // ✅ already URLs
        })),
      },
    },
    include: { pastSchedule: true },
  });

  return NextResponse.json(newPastTour);
}
