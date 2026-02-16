import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { z } from "zod";

const taskUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "done"]).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided",
});

// UPDATE TASK
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }   
) {
  const { id } = await context.params;         

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { userId } = verifyToken(token);
    const body = await req.json();

    // Validate input with Zod
    const parsed = taskUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { title, description, status } = parsed.data;

    await connectDB();

    const updated = await Task.findOneAndUpdate(
      { _id: id, userId },
      { ...(title && { title }), ...(description !== undefined && { description }), ...(status && { status }) },
      { new: true }
    );

    if (!updated) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE TASK
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }   
) {
  const { id } = await context.params;         

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { userId } = verifyToken(token);

    await connectDB();
    const deleted = await Task.findOneAndDelete({ _id: id, userId });

    if (!deleted) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
