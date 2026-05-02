import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // <-- 1. Update the type to a Promise
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { status } = await req.json();
    const resolvedParams = await params; // <-- 2. Await the params

    // Update the task status in the database
    const updatedTask = await prisma.task.update({
      where: { id: resolvedParams.id }, // <-- 3. Use the awaited ID
      data: { status },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}