import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { taskSchema } from "@/validations/task";

export async function GET() {
  const cookieStore = await cookies();   
  const token = cookieStore.get("token")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { userId } = verifyToken(token);

    await connectDB();
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  const cookieStore = await cookies();   
  const token = cookieStore.get("token")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { userId } = verifyToken(token);
    const body = await req.json();

    const parsed = taskSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Invalid task data";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    await connectDB();
    const task = await Task.create({ ...parsed.data, userId });

    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
