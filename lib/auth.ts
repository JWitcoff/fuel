import { NextRequest, NextResponse } from "next/server";

/**
 * Check bearer token auth. Used by external API consumers (OpenClaw).
 * Returns null if auth passes, or a 401 response if it fails.
 */
export function checkAuth(req: NextRequest): NextResponse | null {
  const auth = req.headers.get("authorization");
  if (!auth) {
    // No auth header = frontend call, allow it
    return null;
  }
  const token = process.env.FUEL_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Server misconfigured: no API token" }, { status: 500 });
  }
  if (auth !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
