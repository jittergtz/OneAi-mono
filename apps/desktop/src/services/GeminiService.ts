
// Example structure for GeminiService (you need to implement this)
// Create src/services/GeminiService.ts if it doesn't exist

// src/services/GeminiService.ts
import { getApiKeyFilePath } from "@/electron/src/main";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, // ... other necessary imports
} from "@google/generative-ai";


export { getApiKeyFilePath }; // Re-export for convenience

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private apiKey: string;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error("API key is required for GeminiService.");
        }
        this.apiKey = apiKey;
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    // Simplified formatHistory from your route.ts
    private formatHistory(history: Array<{ role: string; content: string }>): any[] {
         // Gemini API expects { role: 'user' | 'model', parts: [{ text: '...' }] }
         return history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model', // Map 'assistant' to 'model'
            parts: [{ text: msg.content }],
        }));
    }


    async * processRequestStream(
        prompt: string,
        history: Array<{ role: string; content: string }>,
        useSearch: boolean
    ): AsyncIterable<string | { type: 'metadata', sourceLinks: any[] } | { type: 'error', error: string }> {

        console.log(`GeminiService: Processing request. Search: ${useSearch}`);

        try {
            const modelName = useSearch ? "gemini-1.5-flash" : "gemini-1.5-flash"; // Or other models
             // Basic safety settings
            const safetySettings = [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ];

             const generationConfig: any = {
                temperature: 0.7, // Adjust as needed
                top_p: 0.95,
                top_k: 64,
                max_output_tokens: 8192, // Adjust as needed
                // response_mime_type: "text/plain", // Usually inferred
            };


            // Add tools for search if needed (referencing your route.ts logic)
             const tools = useSearch ? [{ googleSearchRetrieval: {} }] : undefined; // Simplified, add dynamic config if needed


            const model = this.genAI.getGenerativeModel({
                model: modelName,
                safetySettings,
                generationConfig,
                tools // Add tools here
            });

            const chatHistory = this.formatHistory(history);

            const result = await model.generateContentStream({
                contents: [...chatHistory, { role: 'user', parts: [{ text: prompt }] }],
            });


            let groundingMetadata: any = null;
            // Check for grounding metadata early if possible (might be in the initial response promise)
             try {
                 const initialResponse = await result.response;
                 if (initialResponse?.candidates?.[0]?.groundingMetadata) {
                    groundingMetadata = initialResponse.candidates[0].groundingMetadata;
                    console.log("GeminiService: Found grounding metadata.");
                 }
             } catch (responseError) {
                 console.warn("GeminiService: Could not get initial response for metadata", responseError);
             }


            // Process the stream
            for await (const chunk of result.stream) {
                try {
                     const text = chunk.text();
                     if (text) {
                         yield text; // Yield text chunks
                     }


                } catch (chunkError) {
                     console.error("GeminiService: Error processing chunk:", chunkError);
                     // Decide if you want to yield an error or just log and continue
                 }
             }

              // After stream, extract and yield sources from metadata if found
             if (groundingMetadata) {
                  const sourceLinks = this.extractSourcesFromGroundingMetadata(groundingMetadata);
                 if (sourceLinks.length > 0) {
                      yield { type: 'metadata', sourceLinks: sourceLinks };
                  }
             }

              console.log("GeminiService: Stream processing finished.");
        } catch (error: any) {
           console.error("GeminiService Error:", error);
             // Check for specific API errors (like quota)
            if (error.message?.includes('429') || error.message?.includes('quota')) {
                 yield { type: 'error', error: 'API quota likely exceeded.' };
            } else if (error.message?.includes('API key not valid')) {
                   yield { type: 'error', error: 'Invalid API Key. Please check settings.' };
             }
              else {
                 yield { type: 'error', error: error.message || 'An unknown error occurred in GeminiService.' };
              }
         }
     }

      // Helper function from your route.ts
     private extractSourcesFromGroundingMetadata(metadata: any): { title: string; url: string }[] {
         if (!metadata || !metadata.groundingChunks) {
             return [];
         }
         const uniqueSources = new Map<string, { title: string; url: string }>();
         metadata.groundingChunks.forEach((chunk: any) => {
            if (chunk.web && chunk.web.uri && chunk.web.title) {
            uniqueSources.set(chunk.web.uri, {
                 title: chunk.web.title,
                 url: chunk.web.uri
             });
            }
         });
         return Array.from(uniqueSources.values());
     }
 }