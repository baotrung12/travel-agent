import { NextResponse } from "next/server";
import {prisma} from "@/app/prisma";
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
  const formData = await req.formData();
  const files = formData.getAll("images") as File[];

  const tourScheduleRaw = formData.get("tourSchedule") as string;
  const tourSchedule = JSON.parse(tourScheduleRaw);

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `tours/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("tour-images")
      .upload(fileName, buffer, { contentType: file.type });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from("tour-images")
      .getPublicUrl(fileName);

    uploadedUrls.push(publicUrl.publicUrl);
  }

  try {
    const tour = await prisma.tour.create({
      data: {
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        tourCode: formData.get("tourCode") as string,
        summary: formData.get("summary") as string,
        promotion: formData.get("promotion") as string,
        departurePoint: formData.get("departurePoint") as string,
        departureStart: new Date(formData.get("departureStart") as string),
        departureEnd: new Date(formData.get("departureEnd") as string),
        duration: formData.get("duration") as string,
        price: Number(formData.get("price")),
        imageUrls: uploadedUrls,
        destination: formData.get("destination") as string,
        category: formData.get("category") as Category,
        tourSchedule: {
          create: tourSchedule.map((item: any) => ({
            date: new Date(item.date),
            title: item.title,
            description: item.description,
          })),
        },
      },
    });

    return NextResponse.json(tour);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create tour" }, { status: 500 });
  }
}
