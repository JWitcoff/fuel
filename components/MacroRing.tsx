"use client";

type Props = {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
};

export default function MacroRing({ label, current, target, color, unit = "" }: Props) {
  const pct = Math.min(current / target, 1);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const remaining = Math.max(0, target - current);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-sm font-semibold" style={{ color }}>{current}</span>
        </div>
      </div>
      <span className="text-[10px] text-white/50 uppercase tracking-wider">{label}</span>
      <span className="font-mono text-[11px] text-white/30">{remaining}{unit} left</span>
    </div>
  );
}
