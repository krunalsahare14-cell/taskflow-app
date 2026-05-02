import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Email is already in use" }, { status: 400 });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // For testing purposes, we'll make everyone an ADMIN so you can test project creation
        role: "ADMIN", 
      },
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}