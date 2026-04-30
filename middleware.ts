import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextResponse, type NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

const authMiddleware = auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/register") ||
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

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!process.env.DATABASE_URL || !process.env.AUTH_SECRET) {
    const isAllowed =
      pathname === "/setup" ||
      pathname.startsWith("/api/setup") ||
      pathname.startsWith("/_next") ||
      /\.(png|jpg|jpeg|svg|ico|css|js|woff|woff2)$/.test(pathname);

    if (isAllowed) return NextResponse.next();
    return NextResponse.redirect(new URL("/setup", request.url));
  }

  return authMiddleware(request, {} as any);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|ico)$).*)",
  ],
};
