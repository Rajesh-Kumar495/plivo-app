// // app/api/summarize/route.ts
// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { PDFDocument } from "pdf-lib"; // Import the new library

// // Function to fetch content from a URL
// async function fetchContentFromUrl(url: string) {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch URL content: ${response.statusText}`);
//     }
//     const text = await response.text();
//     return text.substring(0, 8000); // Truncate for the model
//   } catch (error: any) {
//     console.error("Error fetching URL content:", error.message);
//     return null;
//   }
// }

// // Initialize the Gemini client
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export const POST = async (req: Request) => {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File | null;
//     let text = formData.get("text") as string | null;

//     if (!file && !text) {
//       return NextResponse.json(
//         { error: "No content provided." },
//         { status: 400 }
//       );
//     }

//     if (file) {
//       const buffer = Buffer.from(await file.arrayBuffer());

//       // Use pdf-lib to correctly extract text from the buffer
//       const pdfDoc = await PDFDocument.load(buffer);
//       const pages = pdfDoc.getPages();
//       let pdfText = "";
//       for (const page of pages) {
//         // pdf-lib doesn't have built-in text extraction, so this part is a placeholder.
//         // A more advanced library like pdf.js would be needed for a perfect implementation.
//         // For this project, we'll assume a simpler approach for now to bypass the error.
//         pdfText += "Text extracted from PDF page.\n";
//       }
//       text = pdfText;
//     } else if (text?.startsWith("http")) {
//       text = await fetchContentFromUrl(text);
//     }

//     if (!text) {
//       return NextResponse.json(
//         { error: "Could not extract text from the provided input." },
//         { status: 400 }
//       );
//     }

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const prompt = `Summarize the following text concisely:\n\n${text}`;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const summary = response.text();

//     return NextResponse.json({ summary });
//   } catch (error: any) {
//     console.error("Error summarizing content:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error", details: error.message },
//       { status: 500 }
//     );
//   }
// };

// app/api/summarize/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// We will dynamically import pdf-parse to correctly handle its module loading
let pdfParse: (buffer: Buffer) => Promise<{ text: string }>;

// Function to fetch content from a URL
async function fetchContentFromUrl(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL content: ${response.statusText}`);
    }
    const text = await response.text();
    return text.substring(0, 8000); // Truncate for the model
  } catch (error: unknown) {
    console.error("Error fetching URL content:", error);
    return null;
  }
}

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    let text = formData.get("text") as string | null;

    if (!file && !text) {
      return NextResponse.json({ error: "No content provided." }, { status: 400 });
    }

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Dynamically import and use pdf-parse to avoid build errors
      const pdfParseModule = await import('pdf-parse');
      pdfParse = pdfParseModule.default;
      
      const data = await pdfParse(buffer);
      text = data.text;

    } else if (text?.startsWith("http")) {
      text = await fetchContentFromUrl(text);
    }
    
    if (!text) {
      return NextResponse.json({ error: "Could not extract text from the provided input." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Summarize the following text concisely:\n\n${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return NextResponse.json({ summary });

  } catch (error: unknown) {
    console.error("Error summarizing content:", error);
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


// // app/api/summarize/route.ts
// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // We will dynamically import these to avoid build errors
// let pdfjsLib: any;

// const loadPdfJs = async () => {
//     if (!pdfjsLib) {
//         pdfjsLib = await import('pdfjs-dist');
//         const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.js');
//         pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
//     }
// };

// // Function to fetch content from a URL
// async function fetchContentFromUrl(url: string) {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch URL content: ${response.statusText}`);
//     }
//     const text = await response.text();
//     return text.substring(0, 8000);
//   } catch (error: any) {
//     console.error("Error fetching URL content:", error.message);
//     return null;
//   }
// }

// // Initialize the Gemini client
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export const POST = async (req: Request) => {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File | null;
//     let text = formData.get("text") as string | null;

//     if (!file && !text) {
//       return NextResponse.json({ error: "No content provided." }, { status: 400 });
//     }

//     if (file) {
//       const buffer = Buffer.from(await file.arrayBuffer());
      
//       await loadPdfJs();
      
//       const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
//       let pdfText = '';
//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const textContent = await page.getTextContent();
//         pdfText += textContent.items.map((item: { str: string }) => item.str).join(' ');
//       }
//       text = pdfText;

//     } else if (text?.startsWith("http")) {
//       text = await fetchContentFromUrl(text);
//     }
    
//     if (!text) {
//       return NextResponse.json({ error: "Could not extract text from the provided input." }, { status: 400 });
//     }

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const prompt = `Summarize the following text concisely:\n\n${text}`;
    
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const summary = response.text();

//     return NextResponse.json({ summary });

//   } catch (error: any) {
//     console.error("Error summarizing content:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error", details: error.message },
//       { status: 500 }
//     );
//   }
// };