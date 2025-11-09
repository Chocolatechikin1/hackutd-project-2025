import { defineEventHandler, readBody} from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const message = body.message;

  const endpoint = process.env.AZURE_ENDPOINT;
  const deployment = process.env.AZURE_DEPLOYMENT;
  const apiKey = process.env.AZURE_API_KEY;

  const nvidiaKey = process.env.NVIDIA_API_KEY;
  const nvidiaEndpoint = "https://integrate.api.nvidia.com/v1"; // Base Nemotron API

  try {
    //Ask Azure o3-mini for reasoning or plan
    const azureResponse = await $fetch(
      `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=2025-01-01-preview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: {
          messages: [
            { role: "system", content: "You are a reasoning agent. Plan a structured approach to solve the user's request." },
            { role: "user", content: message },
          ],
          max_completion_tokens: 300,
        },
      }
    );

    const plan = azureResponse?.choices?.[0]?.message?.content || "No plan";

    //Pass the plan to NVIDIA Nemotron for creative/actionable output
    const nvidiaResponse = await $fetch(`${nvidiaEndpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${nvidiaKey}`,
      },
      body: {
        model: "nvidia/nemotron-70b-instruct", // NVIDIA’s model
        messages: [
          {
            role: "system",
            content:
              "You are a creative AI assistant enhancing the reasoning provided. Expand the plan into a clear, helpful response.",
          },
          { role: "user", content: plan },
        ],
        max_tokens: 500,
      },
    });

    const finalOutput = nvidiaResponse?.choices?.[0]?.message?.content || "No output";

    return { reply: finalOutput, reasoning: plan };
  } catch (err: any) {
    console.error("Error:", err);
    return { error: "Failed to connect to Azure or NVIDIA API" };
  }
});
