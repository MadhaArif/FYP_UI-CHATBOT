import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);
    // There isn't a direct "listModels" in the simple SDK easily accessible without extra auth usually,
    // but we can try a few standard ones.
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("test");
        console.log(`✅ Model ${modelName} is working!`);
        return modelName;
      } catch (e) {
        console.log(`❌ Model ${modelName} failed: ${e.message}`);
      }
    }
  } catch (error) {
    console.error("General error:", error);
  }
}

listModels();
