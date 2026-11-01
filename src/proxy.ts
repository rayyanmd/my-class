import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (pathname === "/login" || pathname.startsWith("/login/")) {
    if (session) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    (pathname === "/admin" || pathname.startsWith("/admin/")) &&
    session.user.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static/|_next/image|assets/|favicon.ico|manifest\\.(?:webmanifest|json)|sw\\.js|service-worker\\.js|workbox-.*\\.js|icon1.png|icon0.svg|apple-icon.png|icons/).*)",
  ],
};
