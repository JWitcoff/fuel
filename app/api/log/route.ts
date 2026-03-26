import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { PRESETS, Meal } from "@/lib/constants";
import { addMeal, deleteMeal, getMeals, calcTotals, todayKey } from "@/lib/kv";

export async function POST(req: NextRequest) {
  const authError = checkAuth(req);
  if (authError) return authError;

  const body = await req.json();
  const date = body.date || todayKey();

  let meal: Meal;

  if (body.preset_id) {
    const preset = PRESETS.find((p) => p.id === body.preset_id);
    if (!preset) {
      return NextResponse.json({ error: `Unknown preset: ${body.preset_id}` }, { status: 400 });
    }
    meal = {
      id: Date.now(),
      name: preset.name,
      emoji: preset.emoji,
      cal: preset.cal,
      protein: preset.protein,
      fat: preset.fat,
      carbs: preset.carbs,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
  } else {
    if (!body.name || body.cal == null || body.protein == null || body.fat == null || body.carbs == null) {
      return NextResponse.json({ error: "Missing required fields: name, cal, protein, fat, carbs" }, { status: 400 });
    }
    meal = {
      id: Date.now(),
      name: body.name,
      emoji: body.emoji || "\u{1F37D}\uFE0F",
      cal: Math.round(body.cal),
      protein: Math.round(body.protein),
      fat: Math.round(body.fat),
      carbs: Math.round(body.carbs),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
  }

  const meals = await addMeal(date, meal);
  const totals = calcTotals(meals);

  return NextResponse.json({ success: true, meal, totals });
}

export async function DELETE(req: NextRequest) {
  const authError = checkAuth(req);
  if (authError) return authError;

  const body = await req.json();
  const date = body.date || todayKey();

  if (!body.meal_id) {
    return NextResponse.json({ error: "Missing meal_id" }, { status: 400 });
  }

  const meals = await deleteMeal(date, body.meal_id);
  const totals = calcTotals(meals);

  return NextResponse.json({ success: true, meals, totals });
}
