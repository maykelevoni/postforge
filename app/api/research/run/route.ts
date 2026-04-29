import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { runResearch } from "@/worker/research";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const keyword = typeof body.keyword === "string" && body.keyword.trim()
    ? body.keyword.trim()
    : undefined;

  await runResearch(session.user.id, keyword);

  return NextResponse.json({ ok: true });
}
