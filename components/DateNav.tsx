"use client";

type Props = {
  selectedDate: string;
  onSelect: (date: string) => void;
};

export default function DateNav({ selectedDate, onSelect }: Props) {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  const fmt = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    const day = d.toLocaleDateString("en-US", { weekday: "short" });
    const num = d.getDate();
    return { day, num };
  };

  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2 px-1">
      {dates.map((d) => {
        const { day, num } = fmt(d);
        const isSelected = d === selectedDate;
        const isToday = d === today.toISOString().slice(0, 10);
        return (
          <button
            key={d}
            onClick={() => onSelect(d)}
            className={`flex-shrink-0 flex flex-col items-center gap-0.5 w-11 py-2 rounded-xl transition-all ${
              isSelected
                ? "bg-white/10 text-white"
                : "text-white/30 hover:text-white/50"
            }`}
          >
            <span className="text-[10px] uppercase">{day}</span>
            <span className={`font-mono text-sm font-semibold ${isToday && !isSelected ? "text-macro-cal" : ""}`}>
              {num}
            </span>
          </button>
        );
      })}
    </div>
  );
}
