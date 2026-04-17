import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, landingPageId } = body as {
      name?: string;
      email?: string;
      landingPageId?: string;
    };

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "name and email are required" },
        { status: 400 }
      );
    }

    if (!landingPageId) {
      return NextResponse.json(
        { error: "landingPageId is required" },
        { status: 400 }
      );
    }

    // Look up the landing page — must exist and be published
    const landingPage = await db.landingPage.findUnique({
      where: { id: landingPageId },
      include: { service: true },
    });

    if (!landingPage) {
      return NextResponse.json(
        { error: "Landing page not found" },
        { status: 404 }
      );
    }

    if (landingPage.status !== "published") {
      return NextResponse.json(
        { error: "Landing page is not published" },
        { status: 400 }
      );
    }

    const { userId, serviceId, service, slug } = landingPage;

    // Check for duplicate submission on the same landing page
    const existing = await db.landingPageSubmission.findFirst({
      where: { landingPageId, email },
    });

    if (existing) {
      // Record a duplicate submission and return early
      await db.landingPageSubmission.create({
        data: {
          landingPageId,
          userId,
          name,
          email,
          status: "duplicate",
        },
      });
      return NextResponse.json({ duplicate: true }, { status: 200 });
    }

    // Create the ServiceTicket
    const ticket = await db.serviceTicket.create({
      data: {
        userId,
        serviceId,
        clientName: name,
        clientEmail: email,
        niche: "General",
        message: "",
        source: slug,
        status: "new",
      },
      include: { service: true },
    });

    // Create the LandingPageSubmission record
    await db.landingPageSubmission.create({
      data: {
        landingPageId,
        userId,
        name,
        email,
        status: "new",
      },
    });

    // Upsert Subscriber — skip silently if already subscribed (@@unique([email, userId]))
    await db.subscriber.upsert({
      where: { email_userId: { email, userId } },
      update: {},
      create: {
        name,
        email,
        userId,
        serviceId,
        landingPageId,
        source: slug,
      },
    });

    // Send confirmation email — never fail the whole request on email error
    try {
      await sendConfirmationEmail({
        clientName: ticket.clientName,
        clientEmail: ticket.clientEmail,
        service: ticket.service,
        userId,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing lead webhook:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
