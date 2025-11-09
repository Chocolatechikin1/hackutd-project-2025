<template>
  <UDashboardPanel>
    <template #body>
      <div class="w-full p-4 bg-slate-50 dark:bg-slate-900">
        <MainBudget />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import MainBudget from '~/components/MainBudget.vue'

definePageMeta({
  middleware: 'auth'
})
</script>