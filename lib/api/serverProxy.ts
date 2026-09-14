import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "../../app/api/api";

export async function proxyRequest(request: NextRequest, path: string) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const cookie = request.headers.get("cookie");
  if (contentType) headers.set("content-type", contentType);
  if (cookie) headers.set("cookie", cookie);
  const response = await fetch(
    `${backendUrl}${path}${request.nextUrl.search}`,
    {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.text(),
    },
  );
  const result = new NextResponse(response.body, {
    status: response.status,
    headers: {
      "content-type":
        response.headers.get("content-type") || "application/json",
    },
  });
  for (const value of response.headers.getSetCookie?.() ?? [])
    result.headers.append("set-cookie", value);
  return result;
}
