"use client";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onLog: (weight: number) => void;
};

export default function WeightSheet({ open, onClose, onLog }: Props) {
  const [weight, setWeight] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    const w = parseFloat(weight);
    if (isNaN(w)) return;
    onLog(w);
    setWeight("");
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-[#141419] rounded-t-2xl sheet-enter">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>
        <div className="px-4 pb-8">
          <h3 className="text-lg font-semibold mb-4">Log Weight</h3>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 194.2"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-lg font-mono outline-none focus:ring-1 focus:ring-macro-cal/50 placeholder:text-white/20"
              autoFocus
            />
            <button
              onClick={handleSubmit}
              disabled={!weight}
              className="px-6 rounded-xl bg-macro-cal text-black font-semibold disabled:opacity-30 transition-opacity"
            >
              Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
