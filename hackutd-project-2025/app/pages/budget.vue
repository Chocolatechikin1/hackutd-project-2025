<template>
  <div class="min-h-screen w-full p-4 bg-slate-50 dark:bg-slate-900">
    <MainBudget />
  </div>
</template>

<script setup lang="ts">
import MainBudget from '~/components/MainBudget.vue'
</script>

<style scoped>
/* Page-level styles to make dashboard full-width / full-height */
.min-h-screen {
  min-height: 100vh;
}
</style>