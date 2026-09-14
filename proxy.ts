import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];
const hasSession = (request: NextRequest) =>
  Boolean(
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("refreshToken")?.value,
  );

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPrivate = privateRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
  const isPublic = publicRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
  if (isPrivate && !hasSession(request))
    return NextResponse.redirect(new URL("/sign-in", request.url));
  if (isPublic && hasSession(request))
    return NextResponse.redirect(new URL("/profile", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
