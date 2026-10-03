import { NextResponse } from "next/server";
import { prisma } from "@/app/prisma";

export async function GET() {
  const contacts = await prisma.contactRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(contacts);
}
