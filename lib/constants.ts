export const TARGETS = {
  calories: 1835,
  protein: 195,
  fat: 60,
  carbs: 145,
};

export type Preset = {
  id: string;
  name: string;
  emoji: string;
  cal: number;
  protein: number;
  fat: number;
  carbs: number;
  desc: string;
};

export const PRESETS: Preset[] = [
  { id: "yogurt-bowl", name: "Yogurt bowl", emoji: "\u{1FAD0}", cal: 360, protein: 18, fat: 8, carbs: 48, desc: "Greek yogurt + berries + granola + almond butter" },
  { id: "protein-shake", name: "Protein shake", emoji: "\u{1F964}", cal: 120, protein: 25, fat: 1, carbs: 2, desc: "Whey + water" },
  { id: "shake-banana", name: "Shake + banana", emoji: "\u{1F34C}", cal: 250, protein: 27, fat: 2, carbs: 30, desc: "Whey + water + banana" },
  { id: "eggs-apple", name: "3 eggs + apple + AB", emoji: "\u{1F373}", cal: 400, protein: 22, fat: 24, carbs: 22, desc: "3 hard boiled eggs + apple + 1 tbsp almond butter" },
  { id: "egg-scramble", name: "Egg scramble", emoji: "\u{1F95A}", cal: 320, protein: 23, fat: 20, carbs: 6, desc: "3 eggs + veggies + Swiss cheese" },
  { id: "oat-latte", name: "Oat milk latte", emoji: "\u2615", cal: 135, protein: 1, fat: 7, carbs: 16, desc: "2 espresso + 1 cup Califia oat milk" },
  { id: "dinner-a", name: "Dinner A", emoji: "\u{1F969}", cal: 580, protein: 38, fat: 18, carbs: 42, desc: "Ground beef + sweet potato + broccoli + chili crunch" },
  { id: "dinner-b", name: "Dinner B", emoji: "\u{1F357}", cal: 520, protein: 36, fat: 14, carbs: 44, desc: "Chicken thigh + sweet potato + peas/carrots + lemon" },
  { id: "dinner-c", name: "Dinner C", emoji: "\u{1F373}", cal: 540, protein: 32, fat: 24, carbs: 38, desc: "Egg scramble + peppers + beans + cheese + toast" },
  { id: "dinner-d", name: "Dinner D", emoji: "\u{1F35A}", cal: 600, protein: 40, fat: 22, carbs: 46, desc: "Beef bibimbap: beef + rice + egg + broccoli + chili crunch" },
  { id: "dinner-e", name: "Dinner E", emoji: "\u{1F345}", cal: 520, protein: 36, fat: 16, carbs: 40, desc: "Chicken thigh in Rao's + broccoli + sweet potato" },
  { id: "yogurt-berries", name: "Yogurt + berries", emoji: "\u{1F347}", cal: 180, protein: 16, fat: 0, carbs: 28, desc: "Greek yogurt + blueberries" },
];

export type Meal = {
  id: number;
  name: string;
  emoji: string;
  cal: number;
  protein: number;
  fat: number;
  carbs: number;
  time: string;
};

export type Totals = {
  cal: number;
  protein: number;
  fat: number;
  carbs: number;
};
