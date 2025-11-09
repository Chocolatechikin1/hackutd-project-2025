<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">inteliBudget</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Sign in to manage your budget</p>
      </div>

      <!-- Login Card -->
      <UCard class="shadow-xl">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <UFormField label="Email" name="email" required>
            <UInput
              v-model="email"
              type="email"
              placeholder="Enter your email"
              icon="i-lucide-mail"
              size="lg"
              :disabled="isLoading"
              required
            />
          </UFormField>

          <!-- Password Field -->
          <UFormField label="Password" name="password" required>
            <UInput
              v-model="password"
              type="password"
              placeholder="Enter your password"
              icon="i-lucide-lock"
              size="lg"
              :disabled="isLoading"
              required
            />
          </UFormField>

          <!-- Error Message -->
          <div v-if="errorMessage" class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
          </div>

          <!-- Submit Button -->
          <UButton
            type="submit"
            block
            size="lg"
            :loading="isLoading"
            :disabled="!email || !password"
          >
            Sign In
          </UButton>

          <!-- Demo Hint -->
          <div class="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p class="text-sm text-blue-800 dark:text-blue-300 text-center">
              <strong>Demo Mode:</strong> Enter any email and password to login
            </p>
          </div>
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password'
    return
  }

  isLoading.value = true

  // Simulate network delay for better UX
  await new Promise(resolve => setTimeout(resolve, 500))

  const success = login(email.value, password.value)
  
  if (success) {
    // Redirect to dashboard
    await router.push('/dashboard')
  } else {
    errorMessage.value = 'Invalid email or password'
    isLoading.value = false
  }
}

// Prevent authenticated users from seeing login page
onMounted(() => {
  const { isAuthenticated, checkAuth } = useAuth()
  checkAuth()
  
  if (isAuthenticated.value) {
    router.push('/dashboard')
  }
})
</script>

