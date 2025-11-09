<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center space-y-2">
      <p class="text-gray-700">Redirecting to dashboard…</p>
      <NuxtLink to="/dashboard" class="text-blue-600 underline">Open dashboard</NuxtLink>
    </div>
  </div>
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

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
        

        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          <HomeDateRangePicker v-model="range" class="-ms-1" />

          <HomePeriodSelect v-model="period" :range="range" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UCard :ui="{ body: 'px-4 py-4 sm:p-4'  }">
        <template #header>
          <h3 class="text-base font-semibold">Payment Plan Assistant</h3>
        </template>
        
        <div class="h-64 overflow-y-auto space-y-4 pr-2">
          <div v-for="(msg, index) in chatHistory" :key="index" :class="msg.role === 'user' ? 'text-right' : 'text-left'">
            <div 
              class="inline-block p-3 rounded-lg"
              :class="msg.role === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800'"
            >
              <p style="white-space: pre-wrap;">{{ msg.content }}</p>
            </div>
          </div>
          <div v-if="isLoading" class="text-left">
            <div class="inline-block p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
              <UIcon name="i-lucide-loader-circle" class="animate-spin" /> Thinking...
            </div>
          </div>
        </div>
        
        <template #footer>
          <UForm :state="{}" @submit.prevent="sendMessage" class="flex items-center gap-2">
            <UInput
              v-model="message"
              placeholder="Ask for help with a payment plan..."
              class="flex-1"
              autocomplete="off"
              :disabled="isLoading"
            />
            <UButton
              type="submit"
              icon="i-lucide-send"
              color="primary"
              :loading="isLoading"
              :disabled="isLoading"
            />
          </UForm>
        </template>
      </UCard>

      <HomeStats :period="period" :range="range" />
      <HomeChart :period="period" :range="range" />
      <HomeSales :period="period" :range="range" />
    </template>
  </UDashboardPanel>
</template>
