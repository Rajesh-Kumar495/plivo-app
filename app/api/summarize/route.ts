// app/api/summarize/route.ts
import { NextResponse } from "next/server";
import Cohere from "cohere-ai";
import pdfParse from "pdf-parse";

// Function to fetch content from a URL
async function fetchContentFromUrl(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL content: ${response.statusText}`);
    }
    const text = await response.text();
    return text.substring(0, 4000); // Truncate for the model
  } catch (error: any) {
    console.error("Error fetching URL content:", error.message);
    return null;
  }
}

const cohere = new Cohere.CohereClient({
  token: process.env.COHERE_API_KEY!,
});

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    let text = formData.get("text") as string | null;

    if (!file && !text) {
      return NextResponse.json(
        { error: "No content provided." },
        { status: 400 }
      );
    }

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (file.type === "application/pdf") {
        const data = await pdfParse(buffer);
        text = data.text;
      } else {
        // Simplified handling for other file types
        text = buffer.toString();
      }
    } else if (text?.startsWith("http")) {
      text = await fetchContentFromUrl(text);
    }

    if (!text) {
      return NextResponse.json(
        { error: "Could not extract text from the provided input." },
        { status: 400 }
      );
    }

    // Call Cohere's Summarize API
    const response = await cohere.summarize({
      text: text,
    });

    return NextResponse.json({ summary: response.summary });
  } catch (error: any) {
    console.error("Error summarizing content:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
};