import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma'; // Assuming you setup a Prisma client instance
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Authentication Check
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Role-Based Access Control (RBAC) Check
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden: Only Admins can create tasks" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, projectId, assigneeId, dueDate } = body;

    // 3. Validation
    if (!title || !projectId) {
      return NextResponse.json({ error: "Title and Project ID are required" }, { status: 400 });
    }

    // 4. Database Insertion
    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}