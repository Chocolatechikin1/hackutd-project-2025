import { ref, computed } from 'vue'

export interface BudgetCategory {
  name: string
  budget: number
  spent: number
}

// Shared state across all pages
const budgetCategories = ref<BudgetCategory[]>([
  { name: 'Groceries', budget: 600, spent: 450 },
  { name: 'Dining', budget: 400, spent: 280 },
  { name: 'Transportation', budget: 300, spent: 180 },
  { name: 'Entertainment', budget: 200, spent: 150 },
  { name: 'Shopping', budget: 150, spent: 90 },
  { name: 'Utilities', budget: 250, spent: 0 },
  { name: 'Healthcare', budget: 200, spent: 0 }
])

const monthlyIncome = ref(4500)

export const useBudgetData = () => {
  // Computed totals
  const totalBudget = computed(() => {
    return budgetCategories.value.reduce((sum, cat) => sum + (cat.budget || 0), 0)
  })

  const totalSpent = computed(() => {
    return budgetCategories.value.reduce((sum, cat) => sum + (cat.spent || 0), 0)
  })

  const netSavings = computed(() => 
    monthlyIncome.value - totalSpent.value
  )

  const percentageOfIncome = computed(() => 
    monthlyIncome.value > 0 ? (totalSpent.value / monthlyIncome.value) * 100 : 0
  )

  const savingsPercentage = computed(() => 
    monthlyIncome.value > 0 ? (netSavings.value / monthlyIncome.value) * 100 : 0
  )

  const spendingStatus = computed(() => {
    if (percentageOfIncome.value > 80) return 'High Spending'
    if (percentageOfIncome.value > 60) return 'Moderate'
    return 'Great Savings'
  })

  const highestCategory = computed(() => {
    if (budgetCategories.value.length === 0) {
      return { name: 'N/A', budget: 0, spent: 0 }
    }
    return budgetCategories.value.reduce((prev, current) => 
      (current.spent > prev.spent) ? current : prev
    )
  })

  // AI Budget Generation - generates realistic budgets based on spending patterns
  const generateAIBudget = (categoryName: string, currentSpent: number): number => {
    const baseSuggestions: Record<string, { min: number, max: number, factor: number }> = {
      'Groceries': { min: 500, max: 800, factor: 1.4 },
      'Dining': { min: 300, max: 500, factor: 1.5 },
      'Transportation': { min: 250, max: 400, factor: 1.3 },
      'Entertainment': { min: 150, max: 350, factor: 1.6 },
      'Shopping': { min: 100, max: 300, factor: 1.8 },
      'Utilities': { min: 200, max: 350, factor: 1.2 },
      'Healthcare': { min: 150, max: 400, factor: 1.5 }
    }

    const config = baseSuggestions[categoryName] || { min: 100, max: 300, factor: 1.5 }
    
    if (currentSpent > 0) {
      const suggestedBudget = Math.round(currentSpent * config.factor)
      return Math.min(Math.max(suggestedBudget, config.min), config.max)
    }
    
    return Math.round(config.min + Math.random() * (config.max - config.min))
  }

  // Generate budget for a single category by index
  const generateBudgetForCategory = (index: number) => {
    if (index >= 0 && index < budgetCategories.value.length) {
      const category = budgetCategories.value[index]
      budgetCategories.value[index].budget = generateAIBudget(category.name, category.spent)
    }
  }

  // Generate budgets for all categories
  const generateAllBudgets = () => {
    budgetCategories.value = budgetCategories.value.map(cat => ({
      ...cat,
      budget: generateAIBudget(cat.name, cat.spent)
    }))
  }

  // Update a specific category's budget
  const updateCategoryBudget = (index: number, newBudget: number) => {
    if (index >= 0 && index < budgetCategories.value.length) {
      budgetCategories.value[index].budget = newBudget
    }
  }

  // Update monthly income
  const updateMonthlyIncome = (newIncome: number) => {
    monthlyIncome.value = newIncome
  }

  return {
    // State
    budgetCategories,
    monthlyIncome,
    
    // Computed
    totalBudget,
    totalSpent,
    netSavings,
    percentageOfIncome,
    savingsPercentage,
    spendingStatus,
    highestCategory,
    
    // Actions
    generateBudgetForCategory,
    generateAllBudgets,
    updateCategoryBudget,
    updateMonthlyIncome
  }
}

