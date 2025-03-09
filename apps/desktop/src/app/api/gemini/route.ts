// app/api/gemini/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import * as fsPromises from 'fs/promises';

// Function to get the API key file path
const getApiKeyFilePathForRoute = () => {
  const userDataPath =
    process.env.APPDATA ||
    (process.platform === 'darwin'
      ? process.env.HOME + '/Library/Application Support'
      : '/var/local/appdata');
  const appName = "one"; // Your app name
  return path.join(userDataPath, appName, 'api-key.txt');
};

// Estimate tokens roughly (1 token per word as a simple approximation)
function estimateTokens(text: string): number {
  return text.split(/\s+/).length;
}

// Format conversation history using "content" from each message
function formatHistory(history: Array<{ role: string; content: string }>): string {
  return history.map(msg => `${msg.role}: ${msg.content}`).join("\n");
}

// Helper to collect stream text
async function collectStreamText(streamResult: AsyncIterable<{ text: () => string }>): Promise<string> {
  let fullText = "";
  for await (const chunk of streamResult) {
    fullText += chunk.text();
  }
  return fullText;
}

// Summarize text by calling the model with a summarization prompt
async function summarizeText(model: any, text: string): Promise<string> {
  const summaryPrompt = `Summarize the following conversation in a concise manner, preserving key details:\n\n${text}\n\nSummary:`;
  const summaryConfig = {
    temperature: 0.7,
    top_p: 0.9,
    top_k: 32,
    max_output_tokens: 512,
    response_mime_type: "text/plain",
  };

  const summaryResult = await model.generateContentStream(summaryPrompt, summaryConfig);
  const summary = await collectStreamText(summaryResult.stream);
  return summary.trim();
}

export async function POST(req: NextRequest) {
  console.log("API route called");

  try {
    // Load API key from file
    const filePath = getApiKeyFilePathForRoute();
    let apiKey: string | null = null;
    try {
      const apiKeyFromFile = await fsPromises.readFile(filePath, { encoding: 'utf-8' });
      apiKey = apiKeyFromFile.trim();
      console.log("API Key loaded from file.");
    } catch (readError) {
      const errorMessage = (readError instanceof Error) ? readError.message : String(readError);
      console.warn("Error reading API Key file:", errorMessage);
      return NextResponse.json({ error: "API Key not found. Please configure in settings." }, { status: 400 });
    }

    if (!apiKey) {
      console.warn("API Key is empty or not loaded.");
      return NextResponse.json({ error: "API Key not configured. Please go to settings." }, { status: 400 });
    }

    // Parse request body and destructure both prompt and history
    const body = await req.json();
    const { prompt, history } = body;
    console.log("Prompt received:", prompt);

    if (!prompt) {
      console.log("No prompt provided");
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Define system/role context
    const roleContext = `
    You are a helpful assistant answering questions. Format responses in valid, well-structured HTML. 

    `;
    


    // Build conversation context from history (if provided)
    let contextText = "";
    const MAX_HISTORY_TOKENS = 500; // Threshold for token count
    const RECENT_COUNT = 3; // Number of most recent messages to keep in detail

    if (history && Array.isArray(history) && history.length > 0) {
      const formattedHistory = formatHistory(history);
      const tokenCount = estimateTokens(formattedHistory);
      if (tokenCount > MAX_HISTORY_TOKENS && history.length > RECENT_COUNT) {
        const olderHistory = history.slice(0, history.length - RECENT_COUNT);
        const recentHistory = history.slice(history.length - RECENT_COUNT);
        const olderFormatted = formatHistory(olderHistory);
        console.log("History too long; summarizing older messages.");
        const genAIForSummarization = new GoogleGenerativeAI(apiKey);
        const modelForSummarization = genAIForSummarization.getGenerativeModel({ model: "gemini-2.0-flash" });
        const summary = await summarizeText(modelForSummarization, olderFormatted);
        const recentFormatted = formatHistory(recentHistory);
        contextText = summary + "\n" + recentFormatted;
      } else {
        contextText = formattedHistory;
      }
    }

    // Build the final prompt
    const fullPrompt = `${roleContext}\n\nConversation History:\n${contextText}\n\nUser: ${prompt}\n\nAssistant:`;
    console.log("Full prompt assembled:", fullPrompt.substring(0, 100) + "...");

    // Model generation configuration
    const generationConfig = {
      temperature: 1,
      top_p: 0.95,
      top_k: 64,
      max_output_tokens: 8192,
      response_mime_type: "text/html",
    };

    console.log("Initializing GoogleGenerativeAI with API Key from file");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    console.log("Generating content stream");
    const result = await model.generateContentStream(fullPrompt, generationConfig);

    // Create a ReadableStream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log("Starting stream processing");
          for await (const chunk of result.stream) {
            let text = chunk.text();
            text = text.replace(/^```html\s*/, "").replace(/```$/, "");
            console.log("Chunk received:", text.substring(0, 20) + "...");
          // Convert lines starting with "- " or "• " into <ul><li> format
          controller.enqueue(new TextEncoder().encode(text));



          }
          console.log("Stream complete, closing controller");
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    console.log("Returning stream response");
    return new Response(stream, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: 'Failed to process streaming request' }, { status: 500 });
  }
}
