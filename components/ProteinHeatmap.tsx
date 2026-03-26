"use client";

type DayData = { date: string; protein: number };

type Props = {
  days: DayData[];
  proteinTarget: number;
};

export default function ProteinHeatmap({ days, proteinTarget }: Props) {
  const getColor = (protein: number) => {
    const pct = protein / proteinTarget;
    if (pct >= 0.85) return "bg-macro-protein";
    if (pct >= 0.6) return "bg-yellow-500";
    if (protein === 0) return "bg-white/5";
    return "bg-red-500";
  };

  return (
    <div className="bg-card border border-card-border rounded-xl p-4">
      <h2 className="text-sm font-semibold text-white/70 mb-3">14-Day Protein</h2>
      <div className="flex gap-1.5">
        {days.map((d) => {
          const dayNum = new Date(d.date + "T12:00:00").getDate();
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full aspect-square rounded-sm ${getColor(d.protein)} transition-colors`}
                title={`${d.date}: ${d.protein}g protein`}
              />
              <span className="text-[8px] text-white/20">{dayNum}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-2 justify-end">
        <span className="flex items-center gap-1 text-[9px] text-white/30">
          <span className="w-2 h-2 rounded-sm bg-macro-protein" />85%+
        </span>
        <span className="flex items-center gap-1 text-[9px] text-white/30">
          <span className="w-2 h-2 rounded-sm bg-yellow-500" />60-84%
        </span>
        <span className="flex items-center gap-1 text-[9px] text-white/30">
          <span className="w-2 h-2 rounded-sm bg-red-500" />&lt;60%
        </span>
      </div>
    </div>
  );
}
