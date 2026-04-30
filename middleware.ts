import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Setup mode: DATABASE_URL or AUTH_SECRET not configured — redirect everything to /setup
  if (!process.env.DATABASE_URL || !process.env.AUTH_SECRET) {
    const isAllowed =
      pathname === "/setup" ||
      pathname.startsWith("/api/setup") ||
      pathname.startsWith("/_next") ||
      /\.(png|jpg|jpeg|svg|ico|css|js|woff|woff2)$/.test(pathname);

    if (isAllowed) return NextResponse.next();
    return NextResponse.redirect(new URL("/setup", req.url));
  }

  const isLoggedIn = !!req.auth;
  const isPublic =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/setup") ||
    pathname.startsWith("/api/setup") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/webhooks") ||
    pathname.startsWith("/l/");

  if (!isLoggedIn && !isPublic) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.redirect(new URL("/sign-in", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|ico)$).*)",
  ],
};
