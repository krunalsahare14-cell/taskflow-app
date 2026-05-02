import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { title, projectId } = await req.json();

    if (!title || !projectId) {
      return NextResponse.json({ message: "Title and Project are required" }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        projectId,
        assigneeId: session.user.id, // By default, assign it to the creator
        status: "TODO",
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}