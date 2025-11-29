import { NextResponse } from "next/server";
import {prisma} from "@/app/prisma";
import {supabase} from "@/app/services/supabaseClient";

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
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const tourCode = formData.get("tourCode") as string;
  const departureStart = formData.get("departureStart") as string;
  const departureEnd = formData.get("departureEnd") as string;
  const duration = formData.get("duration") as string;
  const price = Number(formData.get("price"));
  const participants = formData.get("participants")
    ? Number(formData.get("participants"))
    : null;
  const feedback = formData.get("feedback") as string | null;

  // Upload tour images to Supabase
  const tourImagesFiles = formData.getAll("tourImages") as File[];
  const tourImageUrls: string[] = [];

  for (const file of tourImagesFiles) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("past-tour-images") // 👈 your bucket name
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("past-tour-images")
      .getPublicUrl(fileName);

    tourImageUrls.push(publicUrlData.publicUrl);
  }

  // Parse schedule JSON
  const pastScheduleRaw = formData.get("pastSchedule") as string;
  const pastSchedule = pastScheduleRaw ? JSON.parse(pastScheduleRaw) : [];

  // Upload schedule images
  const scheduleWithUrls = await Promise.all(
    pastSchedule.map(async (day: any, idx: number) => {
      const files = formData.getAll(`scheduleImages_${idx}`) as File[];
      const urls: string[] = [];

      for (const file of files) {
        const fileName = `${Date.now()}-${idx}-${file.name}`;
        const { error } = await supabase.storage.from("past-tour-images").upload(fileName, file);
        if (error) throw error;
        const { data: publicUrlData } = supabase.storage.from("past-tour-images").getPublicUrl(fileName);
        urls.push(publicUrlData.publicUrl);
      }

      return {
        date: new Date(day.date),
        title: day.title,
        description: day.description,
        imageUrls: urls,
      };
    })
  );

  const newPastTour = await prisma.pastTour.create({
    data: {
      title,
      slug,
      tourCode,
      departureStart: new Date(departureStart),
      departureEnd: new Date(departureEnd),
      duration,
      price,
      participants,
      feedback,
      tourImages: tourImageUrls,
      pastSchedule: {
        create: scheduleWithUrls,
      },
    },
    include: { pastSchedule: true },
  });

  return NextResponse.json(newPastTour);
}
