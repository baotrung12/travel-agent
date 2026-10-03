import {NextResponse} from "next/server";
import {revalidateTourPages} from "@/lib/revalidatePublic";
import {prisma} from "@/app/prisma";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { ready } = await req.json();
  const tour = await prisma.tour.update({
    where: { id: id },
    data: { ready: ready },
  });

  revalidateTourPages();
  return NextResponse.json(tour);
}
