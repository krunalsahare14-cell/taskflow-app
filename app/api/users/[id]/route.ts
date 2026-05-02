import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // <-- 1. Update the type
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { role } = await req.json();
    const resolvedParams = await params; // <-- 2. Await the params

    if (resolvedParams.id === session.user.id && role === "MEMBER") {
      return NextResponse.json({ message: "You cannot demote yourself" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: resolvedParams.id }, // <-- 3. Use the awaited ID
      data: { role },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}