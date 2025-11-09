<template>
  <div class="space-y-4 relative">
    <!-- Overview card (unchanged layout) -->
    <div class="bg-white shadow-lg overflow-hidden relative border border-gray-200 rounded-lg">
      <!-- make gradient non-interactive so it doesn't block SVG mouse events -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-red-50 opacity-60 pointer-events-none"></div>

      <div class="relative p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                </svg>
              </div>
              <h3 class="text-gray-900 text-2xl">November 2025 Overview</h3>
            </div>
            
            <div class="space-y-3">
              <div>
                <p class="text-gray-600 text-base mb-1">Monthly Income</p>
                <p class="text-gray-900 text-5xl">${{ monthlyIncome.toLocaleString() }}</p>
              </div>
              
              <div class="grid grid-cols-2 gap-4 pt-2">
                <div class="bg-white rounded-lg p-3 border border-red-200 shadow-sm">
                  <p class="text-gray-600 text-base mb-1">Total Spending</p>
                  <p class="text-red-700 text-2xl">${{ totalSpent.toLocaleString() }}</p>
                  <div class="flex items-center gap-1 mt-1">
                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    <span class="text-red-600 text-sm">{{ percentageOfIncome.toFixed(1) }}% of income</span>
                  </div>
                </div>
                
                <div class="bg-white rounded-lg p-3 border border-green-200 shadow-sm">
                  <p class="text-gray-600 text-base mb-1">Net Savings</p>
                  <p class="text-green-700 text-2xl">${{ netSavings.toLocaleString() }}</p>
                  <div class="flex items-center gap-1 mt-1">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-center py-6">
            <div class="relative">
              <svg width="280" height="280" viewBox="0 0 280 280" class="transform -rotate-90">
                <circle
                  cx="140"
                  cy="140"
                  r="100"
                  fill="none"
                  stroke="#e5e7eb"
                  stroke-width="30"
                />
                <circle
                  cx="140"
                  cy="140"
                  r="100"
                  fill="none"
                  stroke="#dc2626"
                  stroke-width="30"
                  :stroke-dasharray="`${spendingArc} ${circumference - spendingArc}`"
                  stroke-linecap="round"
                />
                <circle
                  cx="140"
                  cy="140"
                  r="100"
                  fill="none"
                  stroke="#16a34a"
                  stroke-width="30"
                  :stroke-dasharray="`${savingsArc} ${circumference - savingsArc}`"
                  :stroke-dashoffset="-spendingArc"
                  stroke-linecap="round"
                />
              </svg>
              
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p class="text-gray-600 text-base">Spending Rate</p>
                <p class="text-gray-900 text-4xl font-bold mt-1">{{ percentageOfIncome.toFixed(0) }}%</p>
                <span 
                  :class="[ 
                    'inline-block mt-2 px-3 py-1 rounded-full text-sm',
                    percentageOfIncome > 80 ? 'bg-red-100 text-red-700' : 
                    percentageOfIncome > 60 ? 'bg-orange-100 text-orange-700' : 
                    'bg-green-100 text-green-700'
                  ]"
                >
                  {{ spendingStatus }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <p class="text-gray-700 text-base">Income Allocation</p>
            <p class="text-gray-700 text-base">{{ percentageOfIncome.toFixed(1) }}% spent • {{ ((netSavings / monthlyIncome) * 100).toFixed(1) }}% saved</p>
          </div>
          <div class="h-4 overflow-hidden rounded-full bg-gray-200 flex">
            <div
              class="h-full bg-gradient-to-r from-red-600 to-red-700 transition-all duration-300"
              :style="{ width: `${percentageOfIncome}%` }"
            ></div>
            <div
              class="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
              :style="{ width: `${(netSavings / monthlyIncome) * 100}%` }"
            ></div>
          </div>
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center gap-2">
              <div class="h-3 w-3 rounded-full bg-red-600"></div>
              <p class="text-gray-500 text-sm">Spending: ${{ totalSpent.toLocaleString() }}</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-3 w-3 rounded-full bg-green-600"></div>
              <p class="text-gray-500 text-sm">Savings: ${{ netSavings.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white shadow-md border border-gray-200 rounded-lg">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-gray-900 text-2xl font-semibold">Spending</h3>
      </div>
      <div class="p-6">
        <div class="h-[350px] relative">
          <svg viewBox="0 0 800 350" class="w-full h-full">
            <!-- Grid lines -->
            <line v-for="i in 6" :key="`grid-${i}`" :x1="60" :y1="50 + (i - 1) * 50" :x2="750" :y2="50 + (i - 1) * 50" stroke="#e5e7eb" stroke-width="1" />
            
            <!-- Y-axis labels -->
            <text v-for="(val, i) in [3000, 2500, 2000, 1500, 1000, 500, 0]" :key="`y-${i}`" :x="40" :y="55 + i * 50" class="text-xs fill-gray-600" text-anchor="end">{{ val }}</text>
            
            <!-- X-axis labels -->
            <text v-for="(label, i) in lineChartLabels" :key="`x-${i}`" :x="80 + i * 50" y="320" class="text-xs fill-gray-600" text-anchor="middle">{{ label }}</text>
            
            <!-- Actual spending line -->
            <polyline
              :points="actualLinePoints"
              fill="none"
              stroke="#dc2626"
              stroke-width="3"
            />
            <circle
              v-for="(point, i) in actualPoints"
              :key="`actual-${i}`"
              :cx="point.x"
              :cy="point.y"
              r="5"
              fill="#dc2626"
              class="cursor-pointer"
              @mousemove="showTooltip($event, point.label, point.value)"
              @mouseleave="hideTooltip"
            />
            
            <!-- Projected line -->
            <polyline
              :points="projectedLinePoints"
              fill="none"
              stroke="#2563eb"
              stroke-width="3"
              stroke-dasharray="10,5"
            />
            <circle
              v-for="(point, i) in projectedPoints"
              :key="`proj-${i}`"
              :cx="point.x"
              :cy="point.y"
              r="5"
              fill="#2563eb"
              class="cursor-pointer"
              @mousemove="showTooltip($event, point.label, point.value)"
              @mouseleave="hideTooltip"
            />
            
            <!-- Legend -->
            <g transform="translate(300, 330)">
              <rect x="0" y="0" width="20" height="3" fill="#dc2626" />
              <text x="25" y="8" class="text-xs fill-gray-700">This Month</text>
              <rect x="120" y="0" width="20" height="3" fill="#2563eb" stroke-dasharray="5,5" />
              <text x="145" y="8" class="text-xs fill-gray-700">Projected</text>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- Spending Breakdown -->
    <div class="bg-white shadow-md border border-gray-200 rounded-lg">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-gray-900 text-2xl font-semibold">Spending Breakdown</h3>
      </div>
      <div class="p-6">
        <div class="h-[350px] flex items-center justify-center">
          <div class="relative">
            <svg width="300" height="300" viewBox="0 0 300 300">
              <g v-for="(slice, index) in pieSlices" :key="`slice-${index}`">
                <path
                  :d="slice.path"
                  :fill="slice.color"
                  :transform="`rotate(${slice.startAngle} 150 150)`"
                  class="cursor-pointer"
                  @mousemove="showTooltip($event, slice.name, slice.display)"
                  @mouseleave="hideTooltip"
                />
              </g>
            </svg>
            <!-- Legend -->
            <div class="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full">
              <div class="flex flex-wrap justify-center gap-3">
                <div v-for="(cat, i) in pieCategories" :key="`legend-${i}`" class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: cat.color }"></div>
                  <span class="text-xs text-gray-700">{{ cat.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget Breakdown -->
    <div class="bg-white shadow-md border border-gray-200 rounded-lg">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-gray-900 text-2xl font-semibold">Budget Breakdown</h3>
      </div>
      <div class="p-6">
        <div class="space-y-3">
          <div
            v-for="category in budgetCategories"
            :key="category.name"
            class="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0"
          >
            <div class="flex-1">
              <p class="text-gray-900 text-lg mb-1.5">{{ category.name }}</p>
              <div class="flex items-center gap-2">
                <div class="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    class="h-full bg-gradient-to-r from-red-600 to-red-700"
                    :style="{ width: `${(category.spent / category.budget) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="ml-6 text-right">
              <p class="text-gray-900 text-lg">${{ category.spent }}</p>
              <p class="text-gray-500 text-base">of ${{ category.budget }}</p>
            </div>
          </div>
          
          <div class="border-t-2 border-gray-300 pt-2 mt-2">
            <div class="flex items-center justify-between">
              <p class="text-gray-900 text-xl">Total</p>
              <div class="text-right">
                <p class="text-gray-900 text-xl">${{ totalSpent.toLocaleString() }}</p>
                <p class="text-gray-500 text-lg">of ${{ totalBudget.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tooltip (fixed to viewport so it follows mouse) -->
    <div
      v-if="tooltip.visible"
      class="pointer-events-none z-50"
      :style="{
        position: 'fixed',
        left: tooltip.x + 'px',
        top: tooltip.y + 'px',
        transform: 'translate(8px, 8px)'
      }"
    >
      <div class="bg-white border border-gray-200 shadow-md rounded-md px-3 py-2 text-sm">
        <div class="font-medium text-gray-800">{{ tooltip.title }}</div>
        <div class="text-gray-600 mt-1">{{ tooltip.value }}</div>
      </div>
    </div>
  </div>  
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const budgetCategories = [
  { name: 'Groceries', budget: 600, spent: 450 },
  { name: 'Dining', budget: 400, spent: 280 },
  { name: 'Transportation', budget: 300, spent: 180 },
  { name: 'Entertainment', budget: 200, spent: 150 },
  { name: 'Shopping', budget: 150, spent: 90 },
  { name: 'Utilities', budget: 250, spent: 0 },
  { name: 'Healthcare', budget: 200, spent: 0 }
]

const totalBudget = computed(() => budgetCategories.reduce((sum, cat) => sum + cat.budget, 0))
const totalSpent = computed(() => budgetCategories.reduce((sum, cat) => sum + cat.spent, 0))

const monthlyIncome = 4500
const percentageOfIncome = computed(() => monthlyIncome > 0 ? (totalSpent.value / monthlyIncome) * 100 : 0)
const netSavings = computed(() => monthlyIncome - totalSpent.value)

const circumference = 2 * Math.PI * 100
const spendingArc = computed(() => (totalSpent.value / monthlyIncome) * circumference)
const savingsArc = computed(() => (netSavings.value / monthlyIncome) * circumference)

const spendingStatus = computed(() => {
  if (percentageOfIncome.value > 80) return 'High Spending'
  if (percentageOfIncome.value > 60) return 'Moderate'
  return 'Great Savings'
})

// Line chart data
const lineChartData = [
  { actual: 120, projected: 100 },
  { actual: 250, projected: 200 },
  { actual: 380, projected: 300 },
  { actual: 520, projected: 400 },
  { actual: 640, projected: 500 },
  { actual: 780, projected: 600 },
  { actual: 890, projected: 700 },
  { actual: 1020, projected: 800 },
  { actual: 1150, projected: 900 },
  { actual: null, projected: 1000 },
  { actual: null, projected: 1500 },
  { actual: null, projected: 2000 },
  { actual: null, projected: 2500 },
  { actual: null, projected: 3000 }
]

const lineChartLabels = ['Nov 1', 'Nov 2', 'Nov 3', 'Nov 4', 'Nov 5', 'Nov 6', 'Nov 7', 'Nov 8', 'Nov 9', 'Nov 10', 'Nov 15', 'Nov 20', 'Nov 25', 'Nov 30']

// Build points with label + value so tooltip can use them
const actualPoints = computed(() => {
  return lineChartData
    .map((d, i) => d.actual !== null ? { x: 80 + i * 50, y: 300 - (d.actual! / 3000) * 250, value: d.actual!, label: lineChartLabels[i] } : null)
    .filter((p) => p !== null) as { x: number; y: number; value: number; label: string }[]
})

const projectedPoints = computed(() => {
  return lineChartData.map((d, i) => ({ x: 80 + i * 50, y: 300 - (d.projected / 3000) * 250, value: d.projected, label: lineChartLabels[i] }))
})

const actualLinePoints = computed(() => {
  return actualPoints.value.map(p => `${p.x},${p.y}`).join(' ')
})

const projectedLinePoints = computed(() => {
  return projectedPoints.value.map(p => `${p.x},${p.y}`).join(' ')
})

// Pie chart data
const pieCategories = [
  { name: 'Groceries', value: 450, color: '#dc2626' },
  { name: 'Dining', value: 280, color: '#ea580c' },
  { name: 'Transportation', value: 180, color: '#2563eb' },
  { name: 'Entertainment', value: 150, color: '#0891b2' },
  { name: 'Shopping', value: 90, color: '#f59e0b' }
]

const pieSlices = computed(() => {
  const total = pieCategories.reduce((sum, cat) => sum + cat.value, 0)
  let currentAngle = 0
  
  return pieCategories.map(cat => {
    const percentage = cat.value / total
    const angle = percentage * 360
    
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    
    const x1 = 150 + 120 * Math.cos((Math.PI * startAngle) / 180)
    const y1 = 150 + 120 * Math.sin((Math.PI * startAngle) / 180)
    const x2 = 150 + 120 * Math.cos((Math.PI * endAngle) / 180)
    const y2 = 150 + 120 * Math.sin((Math.PI * endAngle) / 180)
    
    const largeArc = angle > 180 ? 1 : 0
    
    const path = `M 150 150 L ${x1} ${y1} A 120 120 0 ${largeArc} 1 ${x2} ${y2} Z`
    
    currentAngle += angle
    
    return {
      path,
      color: cat.color,
      startAngle,
      name: cat.name,
      value: cat.value,
      percent: percentage,
      display: `${cat.name}: $${cat.value.toLocaleString()} (${(percentage*100).toFixed(0)}%)`
    }
  })
})

/* Tooltip state + handlers */
const tooltip = ref({ visible: false, x: 0, y: 0, title: '', value: '' })

function showTooltip(e: MouseEvent, title: string | undefined, value: any) {
  const offset = 10
  tooltip.value.visible = true
  tooltip.value.title = title ?? ''
  tooltip.value.value = typeof value === 'number' ? `$${value.toLocaleString()}` : String(value)
  // position near cursor (fixed)
  tooltip.value.x = e.clientX + offset
  tooltip.value.y = e.clientY + offset
}

function hideTooltip() {
  tooltip.value.visible = false
}
</script>

<style scoped>
/* ensure dashboard can take full height when page wrapper allows it */
:root { }

/* small improvements for tooltip text legibility */
.z-50 { z-index: 9999; }
</style>