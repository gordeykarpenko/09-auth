import { NextRequest, NextResponse } from "next/server";

const backend =
  process.env.NOTEHUB_BACKEND_URL || "https://notehub-api.goit.study";

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const target = `${backend}/${path.join("/")}${request.nextUrl.search}`;
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const cookie = request.headers.get("cookie");
  if (contentType) headers.set("content-type", contentType);
  if (cookie) headers.set("cookie", cookie);
  const response = await fetch(target, {
    method: request.method,
    headers,
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.text(),
  });
  const result = new NextResponse(response.body, {
    status: response.status,
    headers: {
      "content-type":
        response.headers.get("content-type") || "application/json",
    },
  });
  for (const value of response.headers.getSetCookie?.() ?? []) {
    result.headers.append("set-cookie", value);
  }
  return result;
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
