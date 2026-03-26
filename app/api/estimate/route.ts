import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();

    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json({ error: "Missing meal description" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `You are a nutrition expert. Estimate the macronutrient content of this meal based on the description. Assume a typical adult portion size unless specified otherwise.

Meal: "${description.trim()}"

Return ONLY a JSON object with this exact structure, no other text:
{"name": "short descriptive name", "cal": number, "protein": number, "fat": number, "carbs": number}

Rules:
- "name" should be a clean, short meal name (e.g. "Chipotle Chicken Bowl")
- All macro values should be whole integers (grams for protein/fat/carbs, kcal for cal)
- Be realistic — use USDA-level accuracy for common foods
- If the description mentions a restaurant (Chipotle, etc.), use their actual nutrition data
- If portion size is ambiguous, assume a standard single serving
- Only return the JSON object, nothing else`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    // Extract JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Estimation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
