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
const getGridColor = () => isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'

const defaultOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12
        },
        color: getTextColor()
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
      usePointStyle: true
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: getGridColor()
      },
      ticks: {
        color: getTextColor(),
        callback: function(value: any) {
          return '$' + value.toLocaleString()
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: getTextColor()
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
    type: 'line',
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
