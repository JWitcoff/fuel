import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { image_url } = await req.json();

    if (!image_url) {
      return NextResponse.json({ error: "Missing image_url" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    // Fetch image as ArrayBuffer
    const imageRes = await fetch(image_url);
    const imageBuffer = await imageRes.arrayBuffer();
    const contentType = imageRes.headers.get("content-type") || "image/jpeg";

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: contentType,
                data: Buffer.from(imageBuffer).toString("base64"),
              },
            },
            {
              text: `Analyze this food photo. Estimate the meal name and macronutrient content.
Return ONLY a JSON object with this exact structure:
{"name": "meal name", "cal": number, "protein": number, "fat": number, "carbs": number}

Rules:
- "name" should be a short, descriptive meal name (e.g. "Grilled chicken with rice")
- All numbers should be whole integers
- Estimate reasonable portion sizes based on what you see
- If you cannot identify the food, use "Unknown meal" as the name and estimate conservatively`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const result = JSON.parse(text);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
