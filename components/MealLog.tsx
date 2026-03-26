"use client";
import { Meal } from "@/lib/constants";

type Props = {
  meals: Meal[];
  onDelete: (mealId: number) => void;
  onAddClick: () => void;
};

export default function MealLog({ meals, onDelete, onAddClick }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white/70">Meals</h2>
        <button
          onClick={onAddClick}
          className="text-sm font-medium text-macro-cal hover:text-macro-cal/80 transition-colors"
        >
          + Add meal
        </button>
      </div>
      {meals.length === 0 ? (
        <p className="text-white/20 text-sm text-center py-6">No meals logged yet</p>
      ) : (
        meals.map((meal) => (
          <div
            key={meal.id}
            className="flex items-center gap-3 bg-card border border-card-border rounded-xl px-3 py-3"
          >
            <span className="text-xl">{meal.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{meal.name}</p>
              <p className="font-mono text-[11px] text-white/40">
                {meal.cal}cal &middot; {meal.protein}P &middot; {meal.fat}F &middot; {meal.carbs}C
              </p>
            </div>
            <span className="text-[11px] text-white/20 font-mono">{meal.time}</span>
            <button
              onClick={() => onDelete(meal.id)}
              className="text-white/20 hover:text-red-400 transition-colors text-lg leading-none ml-1"
            >
              &times;
            </button>
          </div>
        ))
      )}
    </div>
  );
}
