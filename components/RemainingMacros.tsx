"use client";
import { Totals, TARGETS } from "@/lib/constants";

type Props = {
  remaining: Totals;
};

const macros: { key: keyof Totals; label: string; color: string; target: number }[] = [
  { key: "cal", label: "Calories", color: "#63cdff", target: TARGETS.calories },
  { key: "protein", label: "Protein", color: "#4ade80", target: TARGETS.protein },
  { key: "fat", label: "Fat", color: "#fbbf24", target: TARGETS.fat },
  { key: "carbs", label: "Carbs", color: "#c084fc", target: TARGETS.carbs },
];

export default function RemainingMacros({ remaining }: Props) {
  return (
    <div className="bg-card border border-card-border rounded-xl p-4">
      <h2 className="text-sm font-semibold text-white/70 mb-3">Remaining</h2>
      <div className="space-y-3">
        {macros.map((m) => {
          const pct = Math.min(remaining[m.key] / m.target, 1);
          return (
            <div key={m.key}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-white/50">{m.label}</span>
                <span className="font-mono text-xs" style={{ color: m.color }}>
                  {remaining[m.key]}{m.key === "cal" ? "" : "g"}
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct * 100}%`, backgroundColor: m.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
