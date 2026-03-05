import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) {
        console.log("API ERROR:", data.error.message);
        console.log("REASON:", data.error.status);
    } else {
        console.log("MODELS COUNT:", data.models ? data.models.length : 0);
        if (data.models) {
            data.models.forEach(m => console.log("- " + m.name));
        }
    }
  } catch (error) {
    console.error("FETCH ERROR:", error.message);
  }
}

listModels();
