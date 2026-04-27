import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(
  request: Request,
  context: any
) {
  const { id } = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminRole = (session.user as any).role;
    if (adminRole !== "SUPERADMIN" && adminRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { role, isBlocked } = await request.json();
    await dbConnect();

    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Prevent blocking or demoting SuperAdmins unless you are a SuperAdmin
    if (user.role === "SUPERADMIN" && adminRole !== "SUPERADMIN") {
      return NextResponse.json({ error: "Cannot modify a SuperAdmin" }, { status: 403 });
    }

    if (role !== undefined) user.role = role;
    if (isBlocked !== undefined) user.isBlocked = isBlocked;

    await user.save();

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
