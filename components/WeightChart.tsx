"use client";

type WeightEntry = { date: string; weight: number };

type Props = {
  weights: WeightEntry[];
  rollingAvg: number | null;
};

export default function WeightChart({ weights, rollingAvg }: Props) {
  if (weights.length === 0) {
    return (
      <div className="bg-card border border-card-border rounded-xl p-4">
        <h2 className="text-sm font-semibold text-white/70 mb-3">Weight Trend</h2>
        <p className="text-white/20 text-sm text-center py-4">No weight data yet</p>
      </div>
    );
  }

  const min = Math.min(...weights.map((w) => w.weight)) - 1;
  const max = Math.max(...weights.map((w) => w.weight)) + 1;
  const range = max - min || 1;

  return (
    <div className="bg-card border border-card-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white/70">Weight Trend</h2>
        {rollingAvg && (
          <span className="font-mono text-xs text-white/40">
            7d avg: <span className="text-macro-cal">{rollingAvg}</span> lbs
          </span>
        )}
      </div>
      <div className="flex items-end gap-1 h-24">
        {weights.map((w) => {
          const height = ((w.weight - min) / range) * 100;
          const d = new Date(w.date + "T12:00:00");
          return (
            <div key={w.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="font-mono text-[9px] text-white/30">{w.weight}</span>
              <div
                className="w-full rounded-t bg-macro-cal/40 min-h-[4px] transition-all"
                style={{ height: `${Math.max(height, 5)}%` }}
              />
              <span className="text-[8px] text-white/20">{d.getDate()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
