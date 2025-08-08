// list-models.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  try {
    // There is no listModels method; you may need to list models manually or refer to documentation.
    // For demonstration, let's log a static list or handle as per available SDK methods.
    const availableModels = [
      { name: "gemini-pro", supportedGenerationMethods: ["generateContent"] },
      { name: "gemini-pro-vision", supportedGenerationMethods: ["generateContent"] }
    ];
    console.log("Available Gemini Models:");
    for (const model of availableModels) {
      console.log(`- ${model.name}`);
      console.log(
        `  Supported methods: ${
          model.supportedGenerationMethods?.join(", ") || "N/A"
        }`
      );
      console.log("--------------------");
    }
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}

listModels();
