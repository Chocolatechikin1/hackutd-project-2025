import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import fetch from "node-fetch";

// Azure Function handler
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const body = req.body || {};
    const message = body.message || "No message provided.";

    const endpoint = process.env.AZURE_ENDPOINT;
    const deployment = process.env.AZURE_DEPLOYMENT;
    const apiKey = process.env.AZURE_API_KEY;

    const nvidiaKey = process.env.NVIDIA_API_KEY;
    const nvidiaEndpoint = "https://integrate.api.nvidia.com/v1";

    // 🧠 Step 1: Ask Azure OpenAI for reasoning/plan
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

    const azureData = await azureResponse.json();
    const plan = azureData?.choices?.[0]?.message?.content || "No plan generated.";

    // 🧩 Step 2: Send plan to NVIDIA Nemotron for creative expansion
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

    const nvidiaData = await nvidiaResponse.json();
    const finalOutput = nvidiaData?.choices?.[0]?.message?.content || "No output generated.";

    // ✅ Return response
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { reasoning: plan, reply: finalOutput },
    };
  } catch (err: any) {
    console.error("Error:", err);
    context.res = {
      status: 500,
      body: { error: "Failed to connect to Azure or NVIDIA API." },
    };
  }
};

export default httpTrigger;
