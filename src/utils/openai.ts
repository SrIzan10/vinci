import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: "https://ai.hackclub.com/proxy/v1"
});