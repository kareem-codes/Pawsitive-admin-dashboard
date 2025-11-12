<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps<{
  data: any
  options?: any
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const isDark = ref(false)

const getTextColor = () => isDark.value ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'

const defaultOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'right' as const,
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12
        },
        color: getTextColor(),
        generateLabels: function(chart: any) {
          const data = chart.data
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label: string, i: number) => {
              const value = data.datasets[0].data[i]
              const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
              
              return {
                text: `${label}: ${value} (${percentage}%)`,
                fillStyle: data.datasets[0].backgroundColor[i],
                hidden: false,
                index: i
              }
            })
          }
          return []
        }
      }
    },
    tooltip: {
      backgroundColor: isDark.value ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
      titleColor: isDark.value ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      bodyColor: isDark.value ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      padding: 12,
      borderColor: isDark.value ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      titleFont: {
        size: 14
      },
      bodyFont: {
        size: 13
      },
      callbacks: {
        label: function(context: any) {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
          return `${label}: ${value} (${percentage}%)`
        }
      }
    }
  }
}))

const createChart = () => {
  if (!chartCanvas.value || !props.data) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: props.data,
    options: { ...defaultOptions.value, ...props.options }
  })
}

const checkDarkMode = () => {
  isDark.value = document.documentElement.classList.contains('dark')
}

watch(() => props.data, () => {
  createChart()
}, { deep: true })

watch(isDark, () => {
  createChart()
})

onMounted(() => {
  checkDarkMode()
  createChart()
  
  // Watch for dark mode changes
  const observer = new MutationObserver(() => {
    checkDarkMode()
  })
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
  
  onBeforeUnmount(() => {
    observer.disconnect()
    if (chartInstance) {
      chartInstance.destroy()
    }
  })
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>
