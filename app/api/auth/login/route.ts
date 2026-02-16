import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { loginSchema } from "@/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { email, password } = parsed.data;
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const token = signToken(user._id.toString());

    const res = NextResponse.json({ message: "Logged in" });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
