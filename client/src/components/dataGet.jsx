import { GoogleGenAI } from "@google/genai";

const apiKey =;

const genAI = new GoogleGenAI(apiKey);

async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: "Explain how AI works in few words" }] }]
  });

  console.log(result.response.text());
}

main();
