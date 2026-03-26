"use client";
import { useState } from "react";
import { PRESETS } from "@/lib/constants";

type Props = {
  open: boolean;
  onClose: () => void;
  onLogPreset: (presetId: string) => void;
  onLogCustom: (meal: { name: string; cal: number; protein: number; fat: number; carbs: number }) => void;
};

export default function AddMealSheet({ open, onClose, onLogPreset, onLogCustom }: Props) {
  const [showCustom, setShowCustom] = useState(false);
  const [name, setName] = useState("");
  const [cal, setCal] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");

  if (!open) return null;

  const handleCustomSubmit = () => {
    if (!name || !cal || !protein || !fat || !carbs) return;
    onLogCustom({
      name,
      cal: parseInt(cal),
      protein: parseInt(protein),
      fat: parseInt(fat),
      carbs: parseInt(carbs),
    });
    setName("");
    setCal("");
    setProtein("");
    setFat("");
    setCarbs("");
    setShowCustom(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-[#141419] rounded-t-2xl sheet-enter max-h-[85vh] overflow-y-auto">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
        <div className="px-4 pb-8">
          <h3 className="text-lg font-semibold mb-4">Add Meal</h3>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => onLogPreset(p.id)}
                className="flex items-center gap-2 bg-card border border-card-border rounded-xl px-3 py-3 text-left hover:bg-white/[0.06] active:bg-white/[0.08] transition-colors"
              >
                <span className="text-lg">{p.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="font-mono text-[10px] text-white/30">{p.cal}cal &middot; {p.protein}P</p>
                </div>
              </button>
            ))}
          </div>

          {!showCustom ? (
            <button
              onClick={() => setShowCustom(true)}
              className="w-full py-3 rounded-xl border border-dashed border-white/10 text-white/40 text-sm hover:border-white/20 hover:text-white/60 transition-colors"
            >
              + Custom meal
            </button>
          ) : (
            <div className="space-y-3 bg-card border border-card-border rounded-xl p-4">
              <input
                type="text"
                placeholder="Meal name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-macro-cal/50 placeholder:text-white/20"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Calories"
                  value={cal}
                  onChange={(e) => setCal(e.target.value)}
                  className="bg-white/5 rounded-lg px-3 py-2.5 text-sm font-mono outline-none focus:ring-1 focus:ring-macro-cal/50 placeholder:text-white/20"
                />
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="bg-white/5 rounded-lg px-3 py-2.5 text-sm font-mono outline-none focus:ring-1 focus:ring-macro-protein/50 placeholder:text-white/20"
                />
                <input
                  type="number"
                  placeholder="Fat (g)"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  className="bg-white/5 rounded-lg px-3 py-2.5 text-sm font-mono outline-none focus:ring-1 focus:ring-macro-fat/50 placeholder:text-white/20"
                />
                <input
                  type="number"
                  placeholder="Carbs (g)"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="bg-white/5 rounded-lg px-3 py-2.5 text-sm font-mono outline-none focus:ring-1 focus:ring-macro-carbs/50 placeholder:text-white/20"
                />
              </div>
              <button
                onClick={handleCustomSubmit}
                disabled={!name || !cal || !protein || !fat || !carbs}
                className="w-full py-2.5 rounded-xl bg-macro-cal text-black font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                Log meal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
