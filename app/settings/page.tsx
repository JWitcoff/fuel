"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.targets) {
          setCalories(String(data.targets.calories));
          setProtein(String(data.targets.protein));
          setFat(String(data.targets.fat));
          setCarbs(String(data.targets.carbs));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calories: parseInt(calories),
          protein: parseInt(protein),
          fat: parseInt(fat),
          carbs: parseInt(carbs),
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Save failed
    } finally {
      setSaving(false);
    }
  };

  const isValid = calories && protein && fat && carbs;

  return (
    <main className="max-w-[480px] mx-auto px-4 pb-20">
      <div className="flex items-center gap-3 pt-6 pb-6">
        <Link
          href="/"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-card border border-card-border text-white/50 hover:text-white/80 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-xs text-white/30">Daily macro targets</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-macro-cal/30 border-t-macro-cal rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-card border border-card-border rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Daily Calories (kcal)</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full bg-white/5 rounded-lg px-3 py-2.5 text-sm font-mono outline-none focus:ring-1 focus:ring-macro-cal/50 placeholder:text-white/20"
                placeholder="e.g. 2000"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Protein (g)</label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full bg-white/5 rounded-lg px-3 py-2.5 text-sm font-mono outline-none focus:ring-1 focus:ring-macro-protein/50 placeholder:text-white/20"
                placeholder="e.g. 150"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Fat (g)</label>
              <input
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full bg-white/5 rounded-lg px-3 py-2.5 text-sm font-mono outline-none focus:ring-1 focus:ring-macro-fat/50 placeholder:text-white/20"
                placeholder="e.g. 65"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Carbs (g)</label>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full bg-white/5 rounded-lg px-3 py-2.5 text-sm font-mono outline-none focus:ring-1 focus:ring-macro-carbs/50 placeholder:text-white/20"
                placeholder="e.g. 250"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!isValid || saving}
            className="w-full py-3 rounded-xl bg-macro-cal text-black font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save targets"}
          </button>

          <div className="bg-card border border-card-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white/70 mb-2">Not sure what to set?</h3>
            <p className="text-xs text-white/40 leading-relaxed">
              A good starting point: multiply your target body weight (lbs) by 10-12 for calories on a cut, 14-16 for maintenance. Set protein to 1g per lb of target body weight. Split remaining calories between fat (20-30%) and carbs.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
