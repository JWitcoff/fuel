"use client";
import { useState, useEffect, useCallback } from "react";
import { DEFAULT_TARGETS, Targets, Meal, Totals } from "@/lib/constants";
import Link from "next/link";
import MacroRing from "@/components/MacroRing";
import DateNav from "@/components/DateNav";
import MealLog from "@/components/MealLog";
import AddMealSheet from "@/components/AddMealSheet";
import WeightSheet from "@/components/WeightSheet";
import WeightChart from "@/components/WeightChart";
import ProteinHeatmap from "@/components/ProteinHeatmap";
import RemainingMacros from "@/components/RemainingMacros";

type WeightEntry = { date: string; weight: number };
type DayProtein = { date: string; protein: number };

export default function Dashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [totals, setTotals] = useState<Totals>({ cal: 0, protein: 0, fat: 0, carbs: 0 });
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [rollingAvg, setRollingAvg] = useState<number | null>(null);
  const [proteinDays, setProteinDays] = useState<DayProtein[]>([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showWeight, setShowWeight] = useState(false);
  const [loading, setLoading] = useState(true);
  const [targets, setTargets] = useState<Targets>(DEFAULT_TARGETS);

  const fetchMeals = useCallback(async (date: string) => {
    try {
      const res = await fetch(`/api/meals?date=${date}`);
      const data = await res.json();
      setMeals(data.meals || []);
      setTotals(data.totals || { cal: 0, protein: 0, fat: 0, carbs: 0 });
    } catch {
      console.error("Failed to fetch meals");
    }
  }, []);

  const fetchWeights = useCallback(async () => {
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      if (data.weight) {
        setRollingAvg(data.weight.rolling_avg_7d);
      }
    } catch {
      console.error("Failed to fetch weights");
    }
  }, []);

  const fetchTargets = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.targets) setTargets(data.targets);
    } catch {
      // Fall back to defaults
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchMeals(selectedDate), fetchTargets()]);

    // Fetch weight data and 14-day protein data
    const weightPromises: Promise<void>[] = [];
    const weightData: WeightEntry[] = [];
    const proteinData: DayProtein[] = [];

    const todayDate = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(todayDate);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);

      weightPromises.push(
        fetch(`/api/meals?date=${dateStr}`)
          .then((r) => r.json())
          .then((data) => {
            const t = data.totals || { protein: 0 };
            proteinData.push({ date: dateStr, protein: t.protein });
          })
          .catch(() => {
            proteinData.push({ date: dateStr, protein: 0 });
          })
      );
    }

    await Promise.all(weightPromises);
    proteinData.sort((a, b) => a.date.localeCompare(b.date));
    setProteinDays(proteinData);

    await fetchWeights();
    setLoading(false);
  }, [selectedDate, fetchMeals, fetchWeights, fetchTargets]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleLogPreset = async (presetId: string, imageUrl?: string) => {
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preset_id: presetId, date: selectedDate, ...(imageUrl && { image_url: imageUrl }) }),
    });
    setShowAddMeal(false);
    fetchMeals(selectedDate);
  };

  const handleLogCustom = async (meal: { name: string; cal: number; protein: number; fat: number; carbs: number; image_url?: string }) => {
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...meal, date: selectedDate }),
    });
    setShowAddMeal(false);
    fetchMeals(selectedDate);
  };

  const handleDeleteMeal = async (mealId: number) => {
    await fetch("/api/log", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meal_id: mealId, date: selectedDate }),
    });
    fetchMeals(selectedDate);
  };

  const handleLogWeight = async (weight: number) => {
    await fetch("/api/weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight, date: selectedDate }),
    });
    setShowWeight(false);
    fetchAllData();
  };

  const remaining: Totals = {
    cal: Math.max(0, targets.calories - totals.cal),
    protein: Math.max(0, targets.protein - totals.protein),
    fat: Math.max(0, targets.fat - totals.fat),
    carbs: Math.max(0, targets.carbs - totals.carbs),
  };

  return (
    <main className="max-w-[480px] mx-auto px-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between pt-6 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fuel</h1>
          <p className="text-xs text-white/30 font-mono">
            {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWeight(true)}
            className="text-xs bg-card border border-card-border rounded-lg px-3 py-2 text-white/50 hover:text-white/80 transition-colors"
          >
            Log weight
          </button>
          <Link
            href="/settings"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-card border border-card-border text-white/30 hover:text-white/60 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Date Nav */}
      <DateNav selectedDate={selectedDate} onSelect={setSelectedDate} />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-macro-cal/30 border-t-macro-cal rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4 mt-4">
          {/* Macro Rings */}
          <div className="flex justify-between px-2">
            <MacroRing label="Calories" current={totals.cal} target={targets.calories} color="#63cdff" />
            <MacroRing label="Protein" current={totals.protein} target={targets.protein} color="#4ade80" unit="g" />
            <MacroRing label="Fat" current={totals.fat} target={targets.fat} color="#fbbf24" unit="g" />
            <MacroRing label="Carbs" current={totals.carbs} target={targets.carbs} color="#c084fc" unit="g" />
          </div>

          {/* Meal Log */}
          <MealLog meals={meals} onDelete={handleDeleteMeal} onAddClick={() => setShowAddMeal(true)} />

          {/* Remaining Macros */}
          <RemainingMacros remaining={remaining} targets={targets} />

          {/* Protein Heatmap */}
          <ProteinHeatmap days={proteinDays} proteinTarget={targets.protein} />

          {/* Weight Chart */}
          <WeightChart weights={weights} rollingAvg={rollingAvg} />
        </div>
      )}

      {/* Bottom Sheets */}
      <AddMealSheet
        open={showAddMeal}
        onClose={() => setShowAddMeal(false)}
        onLogPreset={handleLogPreset}
        onLogCustom={handleLogCustom}
      />
      <WeightSheet open={showWeight} onClose={() => setShowWeight(false)} onLog={handleLogWeight} />
    </main>
  );
}
