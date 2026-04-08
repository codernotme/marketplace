import { NextRequest, NextResponse } from "next/server";

function getBackendBaseUrl(): string {
  const fromServer = process.env.BACKEND_API_URL;
  const fromPublic = process.env.NEXT_PUBLIC_API_URL;
  const raw = fromServer || fromPublic || "http://localhost:8000";
  return raw.replace(/\/$/, "");
}

async function forwardRequest(request: NextRequest, path: string[]): Promise<NextResponse> {
  const backendBase = getBackendBaseUrl();
  const query = request.nextUrl.search || "";
  const targetUrl = `${backendBase}/${path.join("/")}${query}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const authorization = request.headers.get("authorization");

  if (contentType) headers.set("content-type", contentType);
  if (authorization) headers.set("authorization", authorization);

  const method = request.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await request.text() : undefined;

  const response = await fetch(targetUrl, {
    method,
    headers,
    body,
    cache: "no-store",
  });

  const data = await response.arrayBuffer();
  const outHeaders = new Headers();
  const responseContentType = response.headers.get("content-type");
  if (responseContentType) {
    outHeaders.set("content-type", responseContentType);
  }

  return new NextResponse(data, {
    status: response.status,
    headers: outHeaders,
  });
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forwardRequest(request, path);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forwardRequest(request, path);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forwardRequest(request, path);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forwardRequest(request, path);
}
