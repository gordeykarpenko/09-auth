import type { NextRequest } from "next/server";
import { proxyRequest } from "../../../../lib/api/serverProxy";
interface Context {
  params: Promise<{ id: string }>;
}
export async function GET(request: NextRequest, { params }: Context) {
  return proxyRequest(request, `/notes/${(await params).id}`);
}
export async function DELETE(request: NextRequest, { params }: Context) {
  return proxyRequest(request, `/notes/${(await params).id}`);
}
