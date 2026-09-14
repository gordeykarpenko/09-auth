import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  let isAuthenticated = Boolean(accessToken);
  let refreshedResponse: NextResponse | null = null;

  if (!isAuthenticated && refreshToken) {
    try {
      const session = await checkSession();
      isAuthenticated = session.status === 200;
      if (isAuthenticated) {
        refreshedResponse = NextResponse.next();
        for (const cookie of session.headers["set-cookie"] ?? [])
          refreshedResponse.headers.append("set-cookie", cookie);
      }
    } catch {
      isAuthenticated = false;
    }
  }

  const path = request.nextUrl.pathname;
  const isPrivate = privateRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
  const isPublic = publicRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
  if (isPrivate && !isAuthenticated)
    return NextResponse.redirect(new URL("/sign-in", request.url));
  if (isPublic && isAuthenticated)
    return NextResponse.redirect(new URL("/", request.url));
  return refreshedResponse ?? NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
