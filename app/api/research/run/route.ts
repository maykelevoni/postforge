import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { runResearch } from "@/worker/research";

export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await runResearch(session.user.id);

  return NextResponse.json({ ok: true });
}
