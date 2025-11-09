import { defineEventHandler, readBody} from 'h3';
import { tableClient } from '../utils/tableService';
import { v4 as uuidv4 } from 'uuid';
import type { AzureOpenAIResponse, NvidiaAIResponse } from '../../app/types';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  
  const body = await readBody(event);
  const userMessage = body.message;
  const sessionId = body.sessionId || uuidv4();

  //load history from Azure Table Storage
  const history = [];
  try {
    const entities = tableClient.listEntities({
      queryOptions: {
        filter: `PartitionKey eq '${sessionId}'`,
      },
    });
    for await (const entity of entities) {
      history.push({
        role: entity.role,
        content: entity.content,
        timestamp: entity.timestamp,
      });
      }
      //sorter
      history.sort((a, b) => new Date(a.timestamp as string).getTime() - new Date(b.timestamp as string).getTime());
  } catch (err: any) {
    console.warn("Could not load chat history:", err.message);
  }

  //call API keys
  const endpoint = config.azureEndpoint;
  const deployment = config.azureDeployment;
  const apiKey = config.azureApiKey;

  const nvidiaKey = config.nvidiaApiKey;
  const nvidiaEndpoint = "https://integrate.api.nvidia.com/v1"; // Base Nemotron API

  try {
    //Ask Azure o3-mini for reasoning or plan
    const azureResponse = await $fetch<AzureOpenAIResponse>(
      `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=2025-01-01-preview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: {
          messages: [
            { role: "system", content: "You are a financial planning agent. Your goal is to create a step-by-step plan to help a user get a new payment plan. First, identify what customer data is needed (e.g., account balance, payment history). Then, state that you will pass this plan to a creative agent to generate the final options." },
            ...history.map(h => ({
              role: h.role as string,
            content: h.content as string
            })),
            { role: "user", content: userMessage },
          ],
          max_completion_tokens: 300,
        },
      }
    );

    const plan = azureResponse?.choices?.[0]?.message?.content || "No plan";

    //Pass the plan to NVIDIA Nemotron for creative/actionable output
    const nvidiaResponse = await $fetch<NvidiaAIResponse>(`${nvidiaEndpoint}/chat/completions`, {
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
              "You are a friendly and empathetic customer service AI. You have been given a plan from a reasoning agent. Your job is to take that plan and generate 3 clear, creative, and helpful payment plan options for the user. Present them in a friendly, easy-to-understand format.",
          },
          { role: "user", content: plan },
        ],
        max_tokens: 500,
      },
    });

    const finalOutput = nvidiaResponse?.choices?.[0]?.message?.content || "No output";

    //save state
    try {
      const userEntity = {
        partitionKey: sessionId,
        rowKey: uuidv4(),
        role: "user",
        content: userMessage,
        timestamp: new Date().toISOString(),
      };
      await tableClient.upsertEntity(userEntity, "Merge");

      const assistEntity = {
        partitionKey: sessionId,
        rowKey: uuidv4(),
        role: "assistant",
        content: finalOutput,
        timestamp: new Date().toISOString(),
      };
      await tableClient.upsertEntity(assistEntity, "Merge");
    } catch (err: any) {
      console.warn("Could not save chat history:", err.message);
      }
    
    return { reply: finalOutput, reasoning: plan };
  } catch (err: any) {
    console.error("Error:", err);
    return { error: "Failed to connect to Azure or NVIDIA API" };
  }
});
