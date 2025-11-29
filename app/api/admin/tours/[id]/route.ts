import {NextRequest, NextResponse} from "next/server";
import {supabase} from "@/app/services/supabaseClient";
import {prisma} from "@/app/prisma";
import {Category} from "@/app/generated/prisma/enums";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession();
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  const { id } = await context.params;
  const formData = await req.formData();

  // Parse basic fields
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const tourCode = formData.get("tourCode") as string;
  const departureStart = new Date(formData.get("departureStart") as string);
  const departureEnd = new Date(formData.get("departureEnd") as string);
  const duration = formData.get("duration") as string;
  const price = Number(formData.get("price"));
  const destination = formData.get("destination") as string;
  const category = formData.get("category") as Category;

  // Parse tourSchedule
  const tourScheduleRaw = formData.get("tourSchedule") as string;
  console.log("tourScheduleRaw: ", tourScheduleRaw);
  const tourSchedule = JSON.parse(tourScheduleRaw); // array of { date, title, description }

  // Upload new images
  const files = formData.getAll("images") as File[];
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `tours/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("tour-images")
      .upload(fileName, buffer, { contentType: file.type });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from("tour-images")
      .getPublicUrl(fileName);

    uploadedUrls.push(publicUrl.publicUrl);
  }
  const oldImages = formData.get("tourImages") ? (formData.get("tourImages") as String).split(",") : [];
  console.log("oldImages: ", oldImages);
  const imageUrls = [...oldImages.filter((url) => url && url.trim() !== ""), ...uploadedUrls]
  console.log("imageUrls: ", imageUrls);

  // Update tour
  const updatedTour = await prisma.tour.update({
    where: { id: id },
    data: {
      title,
      slug,
      tourCode,
      departureStart,
      departureEnd,
      duration,
      price,
      imageUrls,
      destination,
      category,
      tourSchedule: {
        deleteMany: {}, // remove old schedule
        create: tourSchedule.map((item: any) => ({
          date: new Date(item.date),
          title: item.title,
          description: item.description,
        })),
      },
    },
  });

  return NextResponse.json(updatedTour);
}
