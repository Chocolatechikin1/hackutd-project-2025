import { defineEventHandler, readBody } from 'h3';
import fetch from "node-fetch";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const message = body.message || "No message provided.";

    const endpoint = process.env.AZURE_ENDPOINT;
    const deployment = process.env.AZURE_DEPLOYMENT;
    const apiKey = process.env.AZURE_API_KEY;

    const nvidiaKey = process.env.NVIDIA_API_KEY;
    const nvidiaEndpoint = "https://integrate.api.nvidia.com/v1";

    // Step 1: Ask Azure OpenAI for reasoning/plan
    const azureResponse = await fetch(
      `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=2025-01-01-preview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a reasoning agent. Plan a structured approach to solve the user's request.",
            },
            { role: "user", content: message },
          ],
          max_completion_tokens: 300,
        }),
      }
    );

    const azureData: any = await azureResponse.json();
    const plan = azureData?.choices?.[0]?.message?.content || "No plan generated.";

    // Step 2: Send plan to NVIDIA Nemotron for creative expansion
    const nvidiaResponse = await fetch(`${nvidiaEndpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${nvidiaKey}`,
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-70b-instruct",
        messages: [
          {
            role: "system",
            content:
              "You are a creative assistant. Expand the plan into a clear, actionable, and user-friendly response.",
          },
          { role: "user", content: plan },
        ],
        max_tokens: 500,
      }),
    });

    const nvidiaData: any = await nvidiaResponse.json();
    const finalOutput = nvidiaData?.choices?.[0]?.message?.content || "No output generated.";

    // Return response
    return { reasoning: plan, reply: finalOutput };

  } catch (err: any) {
    console.error("Error:", err);
    // Use createError for proper error handling in Nuxt/h3
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to connect to Azure or NVIDIA API.",
    });
  }
});