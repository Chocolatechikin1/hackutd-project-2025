<template>
  <div class="space-y-4">
    <!-- Month Selector -->
    <div class="flex items-center gap-4">
      <label class="text-gray-700 text-lg">Select Month:</label>
      <USelectMenu
        v-model="selectedMonth"
        :options="months"
        size="lg"
        class="w-[220px]"
      />
    </div>

    <!-- Budget Analysis Blurb -->
    <UCard class="border-capital-blue-200 bg-capital-blue-50 shadow-md">
      <p class="text-gray-700 text-base leading-relaxed">
        <strong class="text-capital-blue-900 text-lg">AI Budget Analysis for {{ selectedMonth }}:</strong>
        Based on your spending patterns, you're on track to stay within budget this month. 
        Your highest spending category is {{ highestCategory.name || 'N/A' }} at ${{ highestCategory.spent.toLocaleString() }}, which is {{ highestCategory.budget > 0 ? ((highestCategory.spent / highestCategory.budget) * 100).toFixed(0) : '0' }}% of your allocated budget. 
        Consider reducing discretionary spending in Dining and Entertainment to maintain a healthy financial cushion. 
        The AI recommends setting aside an additional 10% for unexpected expenses.
      </p>
    </UCard>

    <!-- Editable Budget Breakdown -->
    <UCard class="border-gray-200 shadow-md">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-gray-900 text-2xl font-semibold">Budget Breakdown</h3>
          <UTooltip text="Generate all budgets">
            <UButton
              icon="i-heroicons-arrow-path"
              color="primary"
              variant="outline"
              @click="handleGenerateAllBudgets"
            />
          </UTooltip>
        </div>
      </template>

      <div class="space-y-3">
        <!-- Table Header -->
        <div class="grid grid-cols-[2fr,1fr,1fr,auto] gap-4 border-b-2 border-gray-300 pb-2">
          <p class="text-gray-700 text-lg">Category</p>
          <p class="text-right text-gray-700 text-lg">Budget</p>
          <p class="text-right text-gray-700 text-lg">Spent</p>
          <div class="w-10"></div>
        </div>

        <!-- Category Rows -->
        <div
          v-for="(category, index) in categories"
          :key="category.name"
          class="grid grid-cols-[2fr,1fr,1fr,auto] gap-4 items-center border-b border-gray-100 pb-2 last:border-0"
        >
          <p class="text-gray-900 text-lg">{{ category.name }}</p>
          <div class="flex items-center justify-end gap-1">
            <span class="text-gray-700 text-lg">$</span>
            <UInput
              v-model.number="category.budget"
              type="number"
              class="w-24"
              size="lg"
              :min="0"
              :step="10"
            />
          </div>
          <p class="text-right text-gray-900 text-lg">${{ category.spent.toLocaleString() }}</p>
          <UTooltip text="Generate budget">
            <UButton
              icon="i-heroicons-arrow-path"
              color="primary"
              variant="ghost"
              @click="handleGenerateBudget(index)"
            />
          </UTooltip>
        </div>

        <!-- Total Row -->
        <div class="grid grid-cols-[2fr,1fr,1fr,auto] gap-4 border-t-2 border-gray-300 pt-2 mt-2">
          <p class="text-gray-900 text-xl">Total</p>
          <p class="text-right text-gray-900 text-xl">${{ totalBudget.toLocaleString() }}</p>
          <p class="text-right text-gray-900 text-xl">${{ totalSpent.toLocaleString() }}</p>
          <div class="w-10"></div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-3">
          <div class="flex items-center justify-between mb-1.5">
            <p class="text-gray-700 text-lg">Overall Progress</p>
            <p class="text-gray-700 text-lg">{{ totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : '0.0' }}%</p>
          </div>
          <div class="h-4 overflow-hidden rounded-full bg-gray-200">
            <div
              class="h-full bg-gradient-to-r from-capital-red-600 to-capital-red-700 transition-all duration-300"
              :style="{ width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%` }"
            ></div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- AI Recommendations -->
    <UCard class="border-capital-red-200 bg-capital-red-50 shadow-md">
      <template #header>
        <h3 class="text-capital-red-900 text-2xl font-semibold">AI-Powered Recommendations</h3>
      </template>

      <ul class="space-y-2 text-gray-700 text-base leading-relaxed">
        <li>• <strong>Groceries:</strong> You're spending well within budget. Consider meal planning to optimize further.</li>
        <li>• <strong>Dining:</strong> Current spending is 70% of budget. Great job managing restaurant expenses!</li>
        <li>• <strong>Transportation:</strong> Gas prices have been stable. Your current allocation is appropriate.</li>
        <li>• <strong>Entertainment:</strong> You've used 75% of your entertainment budget. Plan accordingly for the rest of the month.</li>
      </ul>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()

const selectedMonth = ref('November 2025')
const months = [
  'November 2025',
  'December 2025',
  'January 2026',
  'February 2026',
  'March 2026',
  'April 2026',
  'May 2026',
  'June 2026',
  'July 2026',
  'August 2026',
  'September 2026',
  'October 2026'
]

const categories = ref([
  { name: 'Groceries', budget: 600, spent: 450 },
  { name: 'Dining', budget: 400, spent: 280 },
  { name: 'Transportation', budget: 300, spent: 180 },
  { name: 'Entertainment', budget: 200, spent: 150 },
  { name: 'Shopping', budget: 150, spent: 90 },
  { name: 'Utilities', budget: 250, spent: 0 },
  { name: 'Healthcare', budget: 200, spent: 0 }
])

// safe computed for the highest/spoken-about category to avoid accessing categories[0] when undefined
const highestCategory = computed(() => {
  const first = categories.value[0]
  return first ?? { name: 'N/A', budget: 0, spent: 0 }
})

const totalBudget = computed(() => categories.value.reduce((sum, cat) => sum + cat.budget, 0))
const totalSpent = computed(() => categories.value.reduce((sum, cat) => sum + cat.spent, 0))

const generateAIBudget = (categoryName: string): number => {
  const suggestions: Record<string, number> = {
    'Groceries': 650,
    'Dining': 380,
    'Transportation': 320,
    'Entertainment': 220,
    'Shopping': 180,
    'Utilities': 280,
    'Healthcare': 250
  }
  return suggestions[categoryName] || 200
}

const handleGenerateBudget = (index: number) => {
  const cat = categories.value[index]
  if (!cat) {
    toast.add({
      title: 'Budget Generation Failed',
      description: `Category at index ${index} not found`,
      color: 'error'
    })
    return
  }

  cat.budget = generateAIBudget(cat.name)
  
  toast.add({
    title: 'Budget Generated',
    description: `AI-generated budget for ${cat.name}`,
    color: 'primary'
  })
}

const handleGenerateAllBudgets = () => {
  categories.value = categories.value.map(cat => ({
    ...cat,
    budget: generateAIBudget(cat.name)
  }))
  
  toast.add({
    title: 'All Budgets Generated',
    description: 'AI has generated budgets for all categories',
    color: 'primary'
  })
}
</script>
