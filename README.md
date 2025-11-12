# 🐾 Pawsitive Systems - Vue Dashboard

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Nuxt-4.x-00DC82?style=flat&logo=nuxt.js" alt="Nuxt Version"></a>
  <a href="#"><img src="https://img.shields.io/badge/Vue-3.5+-4FC08D?style=flat&logo=vue.js" alt="Vue Version"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat&logo=tailwind-css" alt="TailwindCSS"></a>
</p>

## 📋 Overview

The **Vue Dashboard** is a modern, responsive admin interface for the Pawsitive Systems veterinary clinic management system. Built with Nuxt 4 and Vue 3, it provides a powerful interface for clinic staff to manage appointments, pets, medical records, billing, inventory, and more.

### ✨ Key Features

- **📊 Interactive Dashboard** - Real-time analytics and clinic overview
- **📅 Appointment Management** - Calendar view with drag-and-drop scheduling
- **🐕 Pet Profiles** - Comprehensive pet management with medical history
- **💉 Medical Records** - Digital health records with prescription management
- **💰 Billing & Invoicing** - Invoice generation with PDF export
- **📦 Inventory Control** - Stock management with alerts and tracking
- **👥 User Management** - Role-based access control and permissions
- **📈 Analytics & Reports** - Visual insights with Chart.js
- **🌐 Multi-Language** - Arabic and English support (i18n)
- **🎨 Modern UI** - Clean, intuitive interface with dark mode support
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

- **Framework:** Nuxt 4.2
- **UI Library:** Vue 3.5
- **Language:** TypeScript 5.x
- **Styling:** TailwindCSS 3.x
- **State Management:** Pinia
- **HTTP Client:** Axios
- **Charts:** Chart.js + Vue-ChartJS
- **Icons:** Iconify (MDI)
- **Composables:** VueUse
- **Internationalization:** @nuxtjs/i18n

---

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm 9+ or yarn/pnpm
- Running Laravel backend API

### Quick Setup

1. **Navigate to the dashboard directory**
   ```bash
   cd vue-dashboard-front
   ```

2. **Install dependencies**
   ```bash
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # API Configuration
   NUXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   NUXT_PUBLIC_APP_URL=http://localhost:3000
   
   # App Configuration
   NUXT_PUBLIC_APP_NAME="Pawsitive Systems"
   NUXT_PUBLIC_DEFAULT_LOCALE=en
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The dashboard will be available at `http://localhost:3000`

---

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot-reload
npm run dev -- --host    # Start dev server accessible on network

# Production
npm run build            # Build for production
npm run prod:build       # Build with NODE_ENV=production
npm run preview          # Preview production build
npm run prod:preview     # Preview with production settings

# Code Quality
npm run typecheck        # Run TypeScript type checking
npm run lint             # Run ESLint

# Deployment
npm run deploy           # Run deployment script

# Other
npm run generate         # Generate static site
npm run postinstall      # Prepare Nuxt (runs automatically)
```

---

## 📁 Project Structure

```
vue-dashboard-front/
├── app.vue                 # Root component
├── nuxt.config.ts         # Nuxt configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # TailwindCSS configuration
├── i18n.config.ts         # i18n configuration
├── assets/                # Global assets (CSS, images)
├── components/            # Vue components
│   ├── Dashboard/         # Dashboard widgets
│   ├── Appointments/      # Appointment components
│   ├── Pets/             # Pet management
│   ├── Medical/          # Medical records
│   ├── Billing/          # Invoicing & payments
│   ├── Inventory/        # Stock management
│   ├── Users/            # User management
│   └── UI/               # Reusable UI components
├── composables/          # Composition API composables
│   ├── useApi.ts         # API interaction
│   ├── useAuth.ts        # Authentication
│   └── useToast.ts       # Notifications
├── layouts/              # Page layouts
│   ├── default.vue       # Main layout
│   ├── auth.vue          # Authentication layout
│   └── dashboard.vue     # Dashboard layout
├── pages/                # File-based routing
│   ├── index.vue         # Home/Dashboard
│   ├── login.vue         # Login page
│   ├── appointments/     # Appointment pages
│   ├── pets/            # Pet pages
│   ├── medical/         # Medical record pages
│   ├── billing/         # Billing pages
│   ├── inventory/       # Inventory pages
│   └── settings/        # Settings pages
├── plugins/              # Nuxt plugins
│   ├── axios.ts          # Axios configuration
│   └── chart.ts          # Chart.js setup
├── services/             # API service layer
│   ├── api.ts            # Base API service
│   ├── appointments.ts   # Appointment API
│   ├── pets.ts           # Pet API
│   ├── medical.ts        # Medical records API
│   ├── billing.ts        # Billing API
│   └── inventory.ts      # Inventory API
├── stores/               # Pinia stores
│   ├── auth.ts           # Authentication store
│   ├── appointments.ts   # Appointments store
│   ├── pets.ts           # Pets store
│   └── settings.ts       # App settings
├── types/                # TypeScript type definitions
│   ├── api.ts            # API types
│   ├── models.ts         # Data models
│   └── index.ts          # Exported types
├── i18n/                 # Internationalization
│   ├── en.json           # English translations
│   └── ar.json           # Arabic translations
└── public/               # Static files
    ├── favicon.ico
    └── images/
```

---

## 🔐 Authentication

The dashboard uses token-based authentication with the Laravel backend.

### Login Flow

```typescript
// composables/useAuth.ts
const { login } = useAuth()

await login({
  email: 'admin@clinic.com',
  password: 'password'
})
```

### Protected Routes

Use middleware to protect routes:

```typescript
// pages/dashboard.vue
definePageMeta({
  middleware: 'auth'
})
```

---

## 🎨 Styling & Theming

### TailwindCSS

The project uses TailwindCSS for styling with custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#10B981',
        // ... custom colors
      }
    }
  }
}
```

### Dark Mode

Toggle dark mode using the composable:

```vue
<script setup>
const { isDark, toggleDark } = useDark()
</script>
```

---

## 🌐 Internationalization (i18n)

Support for multiple languages using `@nuxtjs/i18n`:

```vue
<template>
  <h1>{{ $t('dashboard.welcome') }}</h1>
  <button @click="setLocale('ar')">العربية</button>
  <button @click="setLocale('en')">English</button>
</template>

<script setup>
const { locale, setLocale } = useI18n()
</script>
```

### Available Locales

- **English** (`en`)
- **Arabic** (`ar`)

Translation files are located in `i18n/` directory.

---

## 📡 API Integration

### Service Layer

All API calls are organized in the `services/` directory:

```typescript
// services/pets.ts
export const petsService = {
  async getAll(params?: any) {
    return await $fetch('/pets', { params })
  },
  
  async getById(id: number) {
    return await $fetch(`/pets/${id}`)
  },
  
  async create(data: CreatePetDto) {
    return await $fetch('/pets', {
      method: 'POST',
      body: data
    })
  }
}
```

### Using in Components

```vue
<script setup lang="ts">
import { petsService } from '~/services/pets'

const pets = ref([])

onMounted(async () => {
  pets.value = await petsService.getAll()
})
</script>
```

---

## 🗂️ State Management (Pinia)

### Creating a Store

```typescript
// stores/appointments.ts
export const useAppointmentsStore = defineStore('appointments', {
  state: () => ({
    appointments: [],
    loading: false
  }),
  
  actions: {
    async fetchAppointments() {
      this.loading = true
      this.appointments = await appointmentsService.getAll()
      this.loading = false
    }
  }
})
```

### Using in Components

```vue
<script setup>
const appointmentsStore = useAppointmentsStore()

onMounted(() => {
  appointmentsStore.fetchAppointments()
})
</script>
```

---

## 📊 Charts & Analytics

Using Chart.js for data visualization:

```vue
<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, LineElement, PointElement } from 'chart.js'

ChartJS.register(LineElement, PointElement)

const chartData = {
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [{
    label: 'Appointments',
    data: [65, 59, 80]
  }]
}
</script>
```

---

## 🔧 Configuration

### Nuxt Config

Key configurations in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxt/icon'
  ],
  
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      appName: process.env.NUXT_PUBLIC_APP_NAME
    }
  }
})
```

---

## 🐳 Docker Deployment

### Using Docker

```bash
# Build Docker image
docker build -t pawsitive-vue-dashboard .

# Run container
docker run -p 3000:3000 pawsitive-vue-dashboard
```

### Using PM2 (Production)

```bash
# Install PM2
npm install -g pm2

# Build for production
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# View logs
pm2 logs

# Stop
pm2 stop pawsitive-dashboard
```

---

## 🚀 Deployment

### Deploy Script

The project includes a deployment script:

```bash
npm run deploy
```

This will:
1. Pull latest changes
2. Install dependencies
3. Build for production
4. Restart PM2 process

### Environment-Specific Builds

```bash
# Production build
NODE_ENV=production npm run build

# Preview production build
npm run prod:preview
```

---

## 🧪 Testing

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Fix linting issues
npm run lint -- --fix
```

---

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

---

## 🎯 Key Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard overview with analytics |
| `/login` | Authentication page |
| `/appointments` | Appointment management |
| `/pets` | Pet profiles and management |
| `/medical-records` | Medical history and records |
| `/billing` | Invoices and payments |
| `/inventory` | Stock and product management |
| `/users` | User and staff management |
| `/settings` | Clinic settings and preferences |

---

## 🤝 Contributing

1. Follow Vue 3 composition API best practices
2. Use TypeScript for type safety
3. Follow TailwindCSS utility-first approach
4. Write meaningful component names
5. Keep components small and reusable
6. Use Pinia for global state
7. Add proper TypeScript types

---

## 📝 Code Style

- Use `<script setup>` syntax
- Prefer composition API over options API
- Use TypeScript for type safety
- Follow Vue.js style guide
- Use Tailwind utility classes

---

## 🔄 Updates & Maintenance

```bash
# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Update Nuxt
npx nuxi upgrade
```

---

## 📞 Support

For issues or questions:

- Check the [Nuxt documentation](https://nuxt.com/docs)
- Check the [Vue documentation](https://vuejs.org)
- Open an issue in the repository

---

## 🗺️ Roadmap

- [ ] Real-time updates with WebSockets
- [ ] Advanced filtering and search
- [ ] Bulk operations
- [ ] Export to Excel/CSV
- [ ] Mobile app (iOS/Android)
- [ ] Offline mode support
- [ ] Advanced analytics dashboard
- [ ] Custom report builder

---

<p align="center">Built with ❤️ using Nuxt 4 and Vue 3</p>
