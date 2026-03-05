import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
// The SDK might be using an old version or the key is restricted.
// Let's try to use the most basic fetch-like approach if the SDK fails.
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  console.log("Testing with gemini-1.5-flash on v1...");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });
    const result = await model.generateContent("Hi");
    const response = await result.response;
    console.log("V1 SUCCESS:", response.text());
  } catch (error) {
    console.error("V1 ERROR:", error.message);
  }

  console.log("\nTesting with gemini-pro on v1...");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }, { apiVersion: 'v1' });
    const result = await model.generateContent("Hi");
    const response = await result.response;
    console.log("GEMINI-PRO SUCCESS:", response.text());
  } catch (error) {
    console.error("GEMINI-PRO ERROR:", error.message);
  }
}

run();
