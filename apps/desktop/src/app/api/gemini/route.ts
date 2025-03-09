// app/api/gemini/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import * as fsPromises from 'fs/promises';

// Function to get the API key file path
const getApiKeyFilePathForRoute = () => {
  const userDataPath = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : '/var/local/appdata');
  const appName = "one"; // Make sure this is your correct app name
  return path.join(userDataPath, appName, 'api-key.txt');
};


export async function POST(req: NextRequest) {
  console.log("API route called");

  try {
    // --- Load API Key directly from file ---
    const filePath = getApiKeyFilePathForRoute();
    let apiKey: string | null = null; // Explicitly type apiKey as string or null
    try {
      const apiKeyFromFile = await fsPromises.readFile(filePath, { encoding: 'utf-8' });
      apiKey = apiKeyFromFile.trim();
      console.log("API Key loaded from file.");
    } catch (readError) {
      // Type assertion to tell TypeScript readError is likely an Error
      const errorMessage = (readError instanceof Error) ? readError.message : String(readError);
      console.warn("Error reading API Key file (may not exist or other issue):", errorMessage);
      return NextResponse.json({ error: "API Key not found. Please configure in settings." }, { status: 400 });
    }

    if (!apiKey) {
      console.warn("API Key is empty or not loaded.");
      return NextResponse.json({ error: "API Key not configured. Please go to settings." }, { status: 400 });
    }


    // Parse request body
    const body = await req.json();
    const { prompt } = body;

    console.log("Prompt received:", prompt);

    if (!prompt) {
      console.log("No prompt provided");
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Define the role or context for Gemini
    const roleContext = "You are a helpful assistant answering questions, be nice";

    // Model configuration
    const generationConfig = {
      "temperature": 1,
      "top_p": 0.95,
      "top_k": 64,
      "max_output_tokens": 8192,
      "response_mime_type": "text/plain",
    };

    // Combine the role/context with the user's prompt
    const fullPrompt = ` ${prompt}\n\nAssistant:`;

    console.log("Initializing GoogleGenerativeAI with API Key from file");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    console.log("Generating content stream");
    const result = await model.generateContentStream(fullPrompt);

    // Create a ReadableStream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log("Starting stream processing");

          for await (const chunk of result.stream) {
            const text = chunk.text();
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
    // Set correct headers for streaming text
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: 'Failed to process streaming request' },
      { status: 500 }
    );
  }
}