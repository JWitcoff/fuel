import { Redis } from "@upstash/redis";
import { Meal, Totals, TARGETS } from "./constants";

const kv = new Redis({
  url: process.env.FUEL_KV_REST_API_URL || process.env.KV_REST_API_URL || "",
  token: process.env.FUEL_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN || "",
});

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getMeals(date: string): Promise<Meal[]> {
  const meals = await kv.get<Meal[]>(`meals:${date}`);
  return meals || [];
}

export async function addMeal(date: string, meal: Meal): Promise<Meal[]> {
  const meals = await getMeals(date);
  meals.push(meal);
  await kv.set(`meals:${date}`, meals);
  return meals;
}

export async function deleteMeal(date: string, mealId: number): Promise<Meal[]> {
  let meals = await getMeals(date);
  meals = meals.filter((m) => m.id !== mealId);
  await kv.set(`meals:${date}`, meals);
  return meals;
}

export function calcTotals(meals: Meal[]): Totals {
  return meals.reduce(
    (acc, m) => ({
      cal: acc.cal + m.cal,
      protein: acc.protein + m.protein,
      fat: acc.fat + m.fat,
      carbs: acc.carbs + m.carbs,
    }),
    { cal: 0, protein: 0, fat: 0, carbs: 0 }
  );
}

export function calcRemaining(totals: Totals): Totals {
  return {
    cal: Math.max(0, TARGETS.calories - totals.cal),
    protein: Math.max(0, TARGETS.protein - totals.protein),
    fat: Math.max(0, TARGETS.fat - totals.fat),
    carbs: Math.max(0, TARGETS.carbs - totals.carbs),
  };
}

export async function setWeight(date: string, weight: number): Promise<void> {
  await kv.set(`weight:${date}`, weight);
}

export async function getWeight(date: string): Promise<number | null> {
  return kv.get<number>(`weight:${date}`);
}

export async function getWeights(days: number = 14): Promise<{ date: string; weight: number }[]> {
  const results: { date: string; weight: number }[] = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const w = await getWeight(dateStr);
    if (w !== null) {
      results.push({ date: dateStr, weight: w });
    }
  }
  return results.reverse();
}

export function rollingAverage(weights: { weight: number }[], n: number = 7): number | null {
  if (weights.length === 0) return null;
  const recent = weights.slice(-n);
  return +(recent.reduce((s, w) => s + w.weight, 0) / recent.length).toFixed(1);
}
