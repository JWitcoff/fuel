import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { getMeals, calcTotals, todayKey } from "@/lib/kv";

export async function GET(req: NextRequest) {
  const authError = checkAuth(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || todayKey();
  const meals = await getMeals(date);
  const totals = calcTotals(meals);

  return NextResponse.json({ date, meals, totals });
}
