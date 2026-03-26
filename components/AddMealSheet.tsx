"use client";
import { useState, useRef } from "react";
import { PRESETS } from "@/lib/constants";

type Props = {
  open: boolean;
  onClose: () => void;
  onLogPreset: (presetId: string, imageUrl?: string) => void;
  onLogCustom: (meal: { name: string; cal: number; protein: number; fat: number; carbs: number; image_url?: string }) => void;
};

export default function AddMealSheet({ open, onClose, onLogPreset, onLogCustom }: Props) {
  const [showCustom, setShowCustom] = useState(false);
  const [name, setName] = useState("");
  const [cal, setCal] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Step 1: Upload to Blob
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
      const uploadData = await uploadRes.json();
      if (!uploadData.url) return;
      setImageUrl(uploadData.url);
      setUploading(false);

      // Step 2: Analyze with Gemini
      setAnalyzing(true);
      setShowCustom(true);
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: uploadData.url }),
      });
      const result = await analyzeRes.json();

      if (result.name) {
        setName(result.name);
        setCal(String(result.cal || ""));
        setProtein(String(result.protein || ""));
        setFat(String(result.fat || ""));
        setCarbs(String(result.carbs || ""));
      }
    } catch {
      // Upload or analysis failed silently — user can still fill manually
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }

    // Reset file input so the same file can be re-selected
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCustomSubmit = () => {
    if (!name || !cal || !protein || !fat || !carbs) return;
    onLogCustom({
      name,
      cal: parseInt(cal),
      protein: parseInt(protein),
      fat: parseInt(fat),
      carbs: parseInt(carbs),
      image_url: imageUrl,
    });
    setName("");
    setCal("");
    setProtein("");
    setFat("");
    setCarbs("");
    setImageUrl(undefined);
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

          {/* Photo AI identification button */}
          <input type="file" accept="image/*" capture="environment" ref={fileRef} onChange={handlePhotoUpload} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading || analyzing}
            className="w-full mb-4 py-3 rounded-xl bg-macro-cal/10 border border-macro-cal/20 text-macro-cal text-sm font-medium hover:bg-macro-cal/15 active:bg-macro-cal/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <span className="w-4 h-4 border-2 border-macro-cal/30 border-t-macro-cal rounded-full animate-spin" />
                Uploading...
              </>
            ) : analyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-macro-cal/30 border-t-macro-cal rounded-full animate-spin" />
                Analyzing image...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                Snap &amp; identify meal
              </>
            )}
          </button>

          {/* Preset grid */}
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

          {/* Custom meal form */}
          {!showCustom ? (
            <button
              onClick={() => setShowCustom(true)}
              className="w-full py-3 rounded-xl border border-dashed border-white/10 text-white/40 text-sm hover:border-white/20 hover:text-white/60 transition-colors"
            >
              + Custom meal
            </button>
          ) : (
            <div className="space-y-3 bg-card border border-card-border rounded-xl p-4">
              {/* Image preview */}
              {imageUrl && (
                <div className="flex items-center gap-3">
                  <img src={imageUrl} alt="Meal" className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    {analyzing && (
                      <p className="text-xs text-macro-cal flex items-center gap-1.5">
                        <span className="w-3 h-3 border-2 border-macro-cal/30 border-t-macro-cal rounded-full animate-spin" />
                        AI is estimating macros...
                      </p>
                    )}
                    {!analyzing && name && (
                      <p className="text-xs text-white/40">AI estimated &mdash; adjust if needed</p>
                    )}
                  </div>
                  <button onClick={() => { setImageUrl(undefined); setName(""); setCal(""); setProtein(""); setFat(""); setCarbs(""); }} className="text-xs text-white/30 hover:text-white/50">Clear</button>
                </div>
              )}

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
                disabled={!name || !cal || !protein || !fat || !carbs || uploading || analyzing}
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
