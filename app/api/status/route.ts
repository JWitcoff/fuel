import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { getMeals, calcTotals, calcRemaining, getWeights, rollingAverage, getWeight, getTargets, todayKey } from "@/lib/kv";

export async function GET(req: NextRequest) {
  const authError = checkAuth(req);
  if (authError) return authError;

  const date = todayKey();
  const meals = await getMeals(date);
  const totals = calcTotals(meals);
  const targets = await getTargets();
  const remaining = calcRemaining(totals, targets);
  const latestWeight = await getWeight(date);
  const weights = await getWeights(14);
  const avg = rollingAverage(weights, 7);

  return NextResponse.json({
    date,
    meals,
    totals,
    remaining,
    weight: {
      latest: latestWeight,
      rolling_avg_7d: avg,
    },
  });
}
