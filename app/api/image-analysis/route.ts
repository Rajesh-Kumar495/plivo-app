// app/api/image-analysis/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());

    const filePart = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: imageFile.type,
      },
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-vision",
    });
    const prompt = "What is this image about? Give a detailed description.";

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const description = response.text();

    return NextResponse.json({ description });
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
};