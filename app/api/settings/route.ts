import { NextRequest, NextResponse } from "next/server";
import { getTargets, setTargets } from "@/lib/kv";
import { Targets } from "@/lib/constants";

export async function GET() {
  const targets = await getTargets();
  return NextResponse.json({ targets });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { calories, protein, fat, carbs } = body;

    if (!calories || !protein || !fat || !carbs) {
      return NextResponse.json({ error: "All fields required: calories, protein, fat, carbs" }, { status: 400 });
    }

    const targets: Targets = {
      calories: Math.round(Number(calories)),
      protein: Math.round(Number(protein)),
      fat: Math.round(Number(fat)),
      carbs: Math.round(Number(carbs)),
    };

    await setTargets(targets);
    return NextResponse.json({ targets });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
