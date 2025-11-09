<template>
  <UDashboardPanel>
    <div class="h-screen flex items-center justify-center">
      <div class="text-center space-y-2">
        <p class="text-gray-700">Redirecting to dashboard…</p>
        <NuxtLink to="/dashboard" class="text-blue-600 underline">Open dashboard</NuxtLink>
      </div>
    </div>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { sub } from 'date-fns'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { AskApiResponse, Period, Range } from '~/types'

const { isNotificationsSlideoverOpen } = useDashboard()

const items = [[]] satisfies DropdownMenuItem[][]

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')

//chat component
const message = ref('');
const chatHistory = ref<{ role: string, content: string }[]>([]);
const isLoading = ref(false);
const sessionId = ref<string>(crypto.randomUUID()); //unique session id

async function sendMessage() {
  if (!message.value) return;

  isLoading.value = true;

  const userMessage = message.value;
  chatHistory.value.push({ role: 'user', content: userMessage });
  message.value = '';

  try {
    //call api endpoint
    const response = await $fetch<AskApiResponse>('/api/ask', {
      method: 'POST',
      body: {
        message: userMessage,
        sessionId: sessionId.value,
      }
    });

    if (response.reply) {
      chatHistory.value.push({ role: 'assistant', content: response.reply });
      if(response.sessionId) {
        sessionId.value = response.sessionId;
      }
    }
    else {
      throw new Error(response.error || 'Unknown error occured');
    }
  } catch(e: any) {
      chatHistory.value.push({ role: 'assistant', content: `Error: ${e.message}` });
      console.error(e);
    }
  isLoading.value = false;
}
</script>
