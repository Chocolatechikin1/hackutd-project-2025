<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center space-y-2">
      <p class="text-gray-700">Redirecting to dashboard…</p>
      <NuxtLink to="/dashboard" class="text-blue-600 underline">Open dashboard</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Use replace so back button doesn't return to index
  router.replace('/dashboard').catch(() => { /* ignore navigation errors */ })
})
</script>

<style scoped>
.min-h-screen { min-height: 100vh; }
</style>
