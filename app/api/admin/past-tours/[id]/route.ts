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
  const { id } = await context.params;
  const formData = await req.formData();

  // Parse basic fields
  const title = formData.get("title") as string;
  const tourCode = formData.get("tourCode") as string;
  const departureStart = new Date(formData.get("departureStart") as string);
  const departureEnd = new Date(formData.get("departureEnd") as string);
  const duration = formData.get("duration") as string;
  const price = Number(formData.get("price"));
  const participants = Number(formData.get("participants"));
  const feedback = formData.get("feedback") as string;
  const destination = formData.get("destination") as string;
  const category = formData.get("category") as Category;

  // Upload new images for tour
  const files = formData.getAll("images") as File[];
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `tours/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("past-tour-images")
      .upload(fileName, buffer, { contentType: file.type });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from("past-tour-images")
      .getPublicUrl(fileName);

    uploadedUrls.push(publicUrl.publicUrl);
  }
  const oldImages = formData.get("tourImages") ? (formData.get("tourImages") as String).split(",") : [];
  console.log("oldImages: ", oldImages);
  const imageUrls = [...oldImages.filter((url) => url && url.trim() !== ""), ...uploadedUrls]
  console.log("imageUrls: ", imageUrls);

  // Parse schedule JSON (bao gồm imageUrls còn giữ lại)
  const pastScheduleRaw = formData.get("pastSchedule") as string;
  const pastSchedule = pastScheduleRaw ? JSON.parse(pastScheduleRaw) : [];

  // Upload ảnh mới cho schedule
  const scheduleWithUrls = await Promise.all(
    pastSchedule.map(async (day: any, idx: number) => {
      const files = formData.getAll(`scheduleImages_${idx}`) as File[];
      const newUrls: string[] = [];

      for (const file of files) {
        const fileName = `${Date.now()}-${idx}-${file.name}`;
        const { error } = await supabase.storage.from("past-tour-images").upload(fileName, file);
        if (error) throw error;
        const { data: publicUrlData } = supabase.storage
          .from("past-tour-images")
          .getPublicUrl(fileName);
        newUrls.push(publicUrlData.publicUrl);
      }

      // Ghép URL cũ (nếu còn giữ) + URL mới
      const finalUrls = [...(day.imageUrls || []), ...newUrls];

      return {
        id: day.id, // nếu có id thì update, nếu không thì create mới
        date: new Date(day.date),
        title: day.title,
        description: day.description,
        imageUrls: finalUrls,
      };
    })
  );

  const updatedPastTour = await prisma.pastTour.update({
    where: { id: id },
    data: {
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
      tourImages: imageUrls,
      pastSchedule: {
        upsert: scheduleWithUrls.map((day) => ({
          where: { id: day.id ?? "" }, // nếu có id thì update
          update: {
            date: day.date,
            title: day.title,
            description: day.description,
            imageUrls: day.imageUrls,
          },
          create: {
            date: day.date,
            title: day.title,
            description: day.description,
            imageUrls: day.imageUrls,
          },
        })),
      },
    },
    include: { pastSchedule: true },
  });

  return NextResponse.json(updatedPastTour);
}
