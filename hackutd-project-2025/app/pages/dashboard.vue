<template>
  <UDashboardPanel>
    <template #body>
      <div class="w-full p-4 bg-slate-50 dark:bg-slate-900">
        <MainDashboard />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import MainDashboard from '~/components/MainDashboard.vue'
</script>