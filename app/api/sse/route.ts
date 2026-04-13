import { auth } from "@/auth";
import { emitter } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = `event: connected\ndata: ${JSON.stringify({ userId })}\n\n`;
      controller.enqueue(encoder.encode(data));

      // Helper to send SSE events
      const sendEvent = (event: string, data: any) => {
        const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Listen for user-specific events
      const engineUpdateHandler = (data: any) => {
        sendEvent("engine_update", data);
      };

      const postPublishedHandler = (data: any) => {
        sendEvent("post_published", data);
      };

      const discoverNewHandler = (data: any) => {
        sendEvent("discover_new", data);
      };

      // Register event listeners
      emitter.on(`engine_update_${userId}`, engineUpdateHandler);
      emitter.on(`post_published_${userId}`, postPublishedHandler);
      emitter.on(`discover_new_${userId}`, discoverNewHandler);

      // Send heartbeat every 30 seconds
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch (error) {
          clearInterval(heartbeatInterval);
        }
      }, 30000);

      // Cleanup on close
      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeatInterval);
        emitter.off(`engine_update_${userId}`, engineUpdateHandler);
        emitter.off(`post_published_${userId}`, postPublishedHandler);
        emitter.off(`discover_new_${userId}`, discoverNewHandler);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
