// app/api/gemini/route.ts
import { DynamicRetrievalMode, GoogleGenerativeAI } from '@google/generative-ai';
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

  try {
    const summaryResult = await model.generateContentStream(summaryPrompt, summaryConfig);
    const summary = await collectStreamText(summaryResult.stream);
    return summary.trim();
  } catch (error) {
    console.warn("Error summarizing text:", error);
    return "Previous conversation (summary unavailable due to API limitations)";
  }
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

    // Parse request body and destructure prompt, history and useSearch flag
    const body = await req.json();
    const { prompt, history, useSearch = false } = body;
    console.log("Prompt received:", prompt);
    console.log("Search mode:", useSearch ? "enabled" : "disabled");

    if (!prompt) {
      console.log("No prompt provided");
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Define system/role context based on search mode
    const roleContext = useSearch 
      ? `You are a helpful assistant answering questions. Format responses in valid, well-structured HTML.
         You have access to Google Search to provide up-to-date information on current events, facts, and data.
         When search results are available, incorporate them into your response while citing sources.`
      : `You are a helpful assistant answering questions. Format responses in valid, well-structured HTML.
         Answer based on your knowledge and training data only.`;
    
    // Build conversation context from history (if provided)
    let contextText = "";
    const MAX_HISTORY_TOKENS = 500; // Threshold for token count
    const RECENT_COUNT = 3; // Number of most recent messages to keep in detail

    // Initialize GoogleGenerativeAI with API Key
    console.log("Initializing GoogleGenerativeAI with API Key from file");
    const genAI = new GoogleGenerativeAI(apiKey);

    // Create a model for summarization if needed
    const modelForSummarization = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    if (history && Array.isArray(history) && history.length > 0) {
      const formattedHistory = formatHistory(history);
      const tokenCount = estimateTokens(formattedHistory);
      if (tokenCount > MAX_HISTORY_TOKENS && history.length > RECENT_COUNT) {
        const olderHistory = history.slice(0, history.length - RECENT_COUNT);
        const recentHistory = history.slice(history.length - RECENT_COUNT);
        const olderFormatted = formatHistory(olderHistory);
        console.log("History too long; summarizing older messages.");
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

    let model;
    let result;

    try {
      if (useSearch) {
        // Use model with Google Search Retrieval when search is enabled
        console.log("Creating model with Google Search Retrieval enabled");
        model = genAI.getGenerativeModel({
          model: "gemini-1.5-pro",
          tools: [
            {
              googleSearchRetrieval: {
                dynamicRetrievalConfig: {
                  mode: DynamicRetrievalMode.AUTO,
                  dynamicThreshold: 0.7,
                },
              },
            },
          ],
        }, { apiVersion: "v1beta" });
        console.log("Generating content stream with search capability");
      } else {
        // Use normal model without search when search is disabled
        console.log("Creating model without search capability");
        model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
        });
        console.log("Generating content stream without search capability");
      }
      
      // Generate content with the selected model
      result = await model.generateContentStream(fullPrompt, generationConfig);
      console.log(`Successfully using model ${useSearch ? 'with' : 'without'} search capability`);
    } catch (error) {
      console.warn(`Failed to use model ${useSearch ? 'with' : 'without'} search capability:`, error);
      
      // Always fallback to model without search
      console.log("Falling back to model without search capability");
      model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash", // Fallback to a model with potentially different quota
      });
      
      // Modify the prompt to acknowledge search isn't available if search was requested
      const fallbackPrompt = useSearch 
        ? `${roleContext}\n\nNote: Search features are currently unavailable. Please answer based on your knowledge only.\n\nConversation History:\n${contextText}\n\nUser: ${prompt}\n\nAssistant:`
        : fullPrompt;
      
      console.log("Generating content stream with fallback model");
      result = await model.generateContentStream(fallbackPrompt, generationConfig);
    }

    // Create a ReadableStream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log("Starting stream processing");
          for await (const chunk of result.stream) {
            let text = chunk.text();
            text = text.replace(/^```html\s*/, "").replace(/```$/, "");
            console.log("Chunk received:", text.substring(0, 20) + "...");
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check for quota-related errors
    if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("exhausted")) {
      return NextResponse.json({ 
        error: 'API quota exceeded. Please try again later or upgrade your API plan.',
        details: errorMessage
      }, { status: 429 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to process streaming request',
      details: errorMessage
     }, { status: 500 });
  }
}