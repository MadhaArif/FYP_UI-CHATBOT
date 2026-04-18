import OpenAI from "openai";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import connectDB from "../db/connectDB.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    console.log("DEBUG: Natural Chat request received with message:", message);

    // 🔗 Ensure DB is connected first (especially for serverless)
    await connectDB();

    const apiKey = process.env.OPENROUTER_API_KEY; 
    
    if (!apiKey) {
      console.error("❌ ERROR: OPENROUTER_API_KEY is missing in process.env");
      return res.status(200).json({ 
        success: true, 
        reply: "OpenRouter API Key is missing. Please add it to your environment variables." 
      });
    }

    // 1. Fetch real-time system data
    console.log("⏳ Fetching data from MongoDB...");
    const jobs = await Job.find({ visible: true }).limit(20).populate('companyId', 'name');
    const companies = await Company.find().limit(10).select('name location description');
    console.log(`✅ Data fetched. Jobs: ${jobs.length}, Companies: ${companies.length}`);

    const systemContext = `
You are the helpful and professional Campus Connect AI assistant. 
Your goal is to assist students with recruitment, jobs, and platform navigation.

REAL-TIME SYSTEM DATA:
- Jobs Available: ${jobs.length > 0 ? jobs.map(j => `${j.title} at ${j.companyId?.name || 'Unknown'} in ${j.location}`).join('; ') : 'No jobs posted yet.'}
- Registered Companies: ${companies.length > 0 ? companies.map(c => c.name).join(', ') : 'No companies registered yet.'}

GUIDELINES:
1. Be natural, conversational, and helpful. Do NOT be like a machine.
2. If a user asks about jobs in a specific city, look through the 'Jobs Available' list provided above and list only the relevant ones.
3. If no jobs match their specific request, politely tell them we don't have those yet but mention a few other active jobs.
4. Answer the user's question clearly. If they ask for general help, explain what you can do (show jobs, company info, help with resume tips).
5. STRICTLY answer ONLY the latest user message. Do NOT include or repeat answers to previous questions unless the user explicitly asks to recap. Keep your reply focused and concise.
6. Avoid repeating disclaimers or previously given information across turns unless requested.
7. Use recent conversation context only to understand pronouns or references, but do not merge topics.
8. Use the system data as your primary source of truth for jobs and companies.
9. Do NOT repeat the user's question, do NOT include chat history, and do NOT add anything extra that the user didn't ask for.
10. Do NOT greet unless the user greets you first. Do NOT ask follow-up questions unless the user asks for suggestions/options.
11. Reply in the same language as the user's latest message. If the user uses Roman Urdu / Urdu-English mix, respond in the same style.

STYLE:
- Keep replies concise: max 2 short paragraphs or up to 4 bullets.
- Personalize with the user's name if they share it.
- Use a simple Urdu-English mix when helpful, but keep it clear and professional.

WHEN ASKED ABOUT GOOGLE/INTERNET ACCESS:
- Respond politely and briefly: "Mere paas direct Google search nahi hai."
`;

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey.replace(/"/g, '').trim(),
      defaultHeaders: {
        "HTTP-Referer": "https://campus-connect-app.vercel.app",
        "X-Title": "Campus Connect App",
      }
    });

    // Construct messages with trimmed recent history to avoid topic-mixing
    const recentHistory = Array.isArray(history) ? history.slice(-4) : []; // keep at most the last 4 entries
    const historyMessages = [];

    for (const h of recentHistory) {
      if (h?.user) historyMessages.push({ role: "user", content: String(h.user) });
      if (h?.bot) historyMessages.push({ role: "assistant", content: String(h.bot) });
    }

    const messages = [
      { role: "system", content: systemContext },
      ...historyMessages,
      { role: "user", content: message }
    ];

    console.log("⏳ Sending request to OpenRouter...");
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: messages,
    });
    console.log("✅ Received reply from OpenRouter.");

    let reply = completion.choices?.[0]?.message?.content ?? "";
    reply = String(reply).trim();

    if (/(^|\n)\s*(user|human|customer)\s*:/i.test(reply)) {
      const lines = reply.split(/\r?\n/);
      reply = lines.filter((l) => !/^\s*(user|human|customer)\s*:/i.test(l)).join("\n").trim();
    }

    const assistantMarkerMatch = reply.match(/(?:^|\n)\s*(assistant|bot)\s*:\s*([\s\S]*)/i);
    if (assistantMarkerMatch) reply = assistantMarkerMatch[2].trim();

    console.log("✅ Natural Chatbot Success Response generated");
    res.json({
      success: true,
      reply: reply,
    });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(200).json({ 
      success: true, 
      reply: "I'm having a bit of trouble connecting to the data right now. How else can I help you?" 
    });
  }
};
