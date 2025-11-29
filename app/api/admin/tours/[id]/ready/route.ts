import {NextResponse} from "next/server";
import {prisma} from "@/app/prisma";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { ready } = await req.json();
  const tour = await prisma.tour.update({
    where: { id: id },
    data: { ready: ready },
  });

  return NextResponse.json(tour);
}
