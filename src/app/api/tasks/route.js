import { fetchUser } from "@/app/lib/fetchUser.js";
import { prisma } from "@/app/lib/prisma.js";
import { NextResponse } from "next/server.js";

export async function POST(req, res) {
  try {
    const { name, pet, category, worth, isBonus, dueDate } = await req.json();

    const user = await fetchUser();

    const task = await prisma.task.create({
      data: {
        name,
        userId: user.id,
        petId: pet.id,
        category: category,
        worth: worth,
        isBonus,
        dueDate,
      },
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function PUT(req, res) {
  const { petId, isCompleted, worth } = await req.json();

  const user = await fetchUser();
  return NextResponse.json({ success: true, petId, isCompleted, worth });
}
