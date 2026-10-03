import { NextResponse } from "next/server";
import { prisma } from "@/app/prisma";
import { ContactStatus } from "@/app/generated/prisma/enums";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { status } = await req.json();
  if (!Object.values(ContactStatus).includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const contact = await prisma.contactRequest.update({ where: { id }, data: { status } });
  return NextResponse.json(contact);
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await prisma.contactRequest.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
