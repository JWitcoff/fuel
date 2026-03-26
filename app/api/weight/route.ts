import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { setWeight, getWeights, rollingAverage, todayKey } from "@/lib/kv";

export async function POST(req: NextRequest) {
  const authError = checkAuth(req);
  if (authError) return authError;

  const body = await req.json();
  const date = body.date || todayKey();

  if (body.weight == null) {
    return NextResponse.json({ error: "Missing weight" }, { status: 400 });
  }

  await setWeight(date, body.weight);
  const weights = await getWeights(14);
  const avg = rollingAverage(weights, 7);

  return NextResponse.json({ success: true, date, weight: body.weight, rolling_avg_7d: avg });
}
