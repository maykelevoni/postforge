import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { triggerFullRun } from "@/worker";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Trigger full engine run in background
    triggerFullRun(userId).catch((error) => {
      console.error(`Error in engine run for user ${userId}:`, error);
    });

    return NextResponse.json({
      success: true,
      message: "Engine started",
    });
  } catch (error) {
    console.error(`Failed to start engine for user ${userId}:`, error);
    return NextResponse.json(
      { error: "Failed to start engine" },
      { status: 500 }
    );
  }
}
