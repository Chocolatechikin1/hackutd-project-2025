import { defineEventHandler, readBody} from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const message = body.message;

  const endpoint = process.env.AZURE_ENDPOINT;
  const deployment = process.env.AZURE_DEPLOYMENT;
  const apiKey = process.env.AZURE_API_KEY;

  try {
    const res = await $fetch(`${endpoint}openai/deployments/${deployment}/chat/completions?api-version=2025-01-01-preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: {
        messages: [{ role: 'user', content: message }],
        max_completion_tokens: 500,
      },
    });

    return { reply: res?.choices?.[0]?.message?.content ?? "No response" };
  } catch (err: any) {
    console.error(err);
    return { error: 'Failed to connect to Azure OpenAI' };
  }
});
