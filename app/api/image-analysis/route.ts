// app/api/image-analysis/route.ts
import { NextResponse } from "next/server";

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

    const response = await fetch("http://localhost:5000/caption", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    // Corrected: `any` to `unknown`
    console.error("Error analyzing image:", error);
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
};
