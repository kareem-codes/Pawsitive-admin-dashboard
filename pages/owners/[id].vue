<template>
  <div class="animate-fade-in">
    <!-- Header -->
    <div class="mb-8">
      <button
        @click="router.back()"
        class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors">
        <Icon name="mdi:arrow-left" class="w-5 h-5" />
        {{ t('common.goBack') }}
      </button>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 flex items-center justify-center">
            <Icon name="mdi:account" class="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {{ owner?.name || t('owners.title') }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              {{ t('owners.clientProfile') }}
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <NuxtLink
            :to="`/appointments/create?owner_id=${route.params.id}`"
            class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold">
            <Icon name="mdi:calendar-plus" class="w-5 h-5" />
            {{ t('owners.bookAppointment') }}
          </NuxtLink>
          <NuxtLink
            :to="`/owners/create?id=${route.params.id}`"
            class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold">
            <Icon name="mdi:pencil" class="w-5 h-5" />
            {{ t('common.edit') }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <Icon name="mdi:loading" class="w-12 h-12 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">{{ t('common.loading') }}</p>
    </div>

    <!-- Owner Details -->
    <div v-else-if="owner" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Information -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Contact Information Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:card-account-details" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {{ t('owners.contactInformation') }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('owners.name') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white">{{ owner.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('owners.email') }}
              </label>
              <a :href="`mailto:${owner.email}`" class="text-base font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                {{ owner.email }}
              </a>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('owners.phone') }}
              </label>
              <a :href="`tel:${owner.phone}`" class="text-base font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                {{ owner.phone }}
              </a>
            </div>
          </div>
        </div>

        <!-- Address Card -->
        <div v-if="owner.address || owner.city || owner.state || owner.postal_code" class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-xl p-6 border border-blue-200 dark:border-blue-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:map-marker" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            {{ t('owners.shippingAddress') }}
          </h2>

          <div class="bg-white/60 dark:bg-zinc-900/60 rounded-xl p-5 border border-blue-100 dark:border-blue-800/50">
            <div class="space-y-3">
              <div v-if="owner.address" class="flex items-start gap-3">
                <Icon name="mdi:home-map-marker" class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ t('owners.streetAddress') }}</p>
                  <p class="text-base font-semibold text-gray-900 dark:text-white">{{ owner.address }}</p>
                </div>
              </div>

              <div v-if="owner.city || owner.state || owner.postal_code" class="flex items-start gap-3">
                <Icon name="mdi:city" class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ t('owners.cityStatePostal') }}</p>
                  <p class="text-base font-semibold text-gray-900 dark:text-white">
                    {{ [owner.city, owner.state, owner.postal_code].filter(Boolean).join(', ') }}
                  </p>
                </div>
              </div>

              <!-- Map Link -->
              <div v-if="owner.address" class="pt-3 border-t border-blue-100 dark:border-blue-800/50">
                <a
                  :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([owner.address, owner.city, owner.state, owner.postal_code].filter(Boolean).join(', '))}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm transition-colors">
                  <Icon name="mdi:google-maps" class="w-4 h-4" />
                  {{ t('owners.viewOnMap') }}
                  <Icon name="mdi:open-in-new" class="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Emergency Contact Card -->
        <div v-if="owner.emergency_contact || owner.emergency_phone" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:phone-alert" class="w-6 h-6 text-red-600 dark:text-red-400" />
            {{ t('owners.emergencyContactInfo') }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="owner.emergency_contact">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('owners.emergencyContact') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white">{{ owner.emergency_contact }}</p>
            </div>

            <div v-if="owner.emergency_phone">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('owners.emergencyPhone') }}
              </label>
              <a :href="`tel:${owner.emergency_phone}`" class="text-base font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                {{ owner.emergency_phone }}
              </a>
            </div>
          </div>
        </div>

        <!-- Notes Card -->
        <div v-if="owner.notes" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:note-text" class="w-6 h-6 text-amber-600 dark:text-amber-400" />
            {{ t('common.notes') }}
          </h2>

          <div class="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
            <p class="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{{ owner.notes }}</p>
          </div>
        </div>

        <!-- Pets -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="mdi:paw" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
              {{ t('owners.pets') }} ({{ pets.length }})
            </h2>
            <NuxtLink
              :to="`/pets/create?owner_id=${owner.id}`"
              class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold text-sm transition-colors flex items-center gap-1">
              <Icon name="mdi:plus" class="w-4 h-4" />
              {{ t('owners.addPet') }}
            </NuxtLink>
          </div>

          <div v-if="loadingPets" class="text-center py-8">
            <Icon name="mdi:loading" class="w-8 h-8 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
          </div>

          <div v-else-if="pets.length === 0" class="text-center py-8">
            <Icon name="mdi:paw-off" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p class="text-gray-500 dark:text-gray-400 mb-4">{{ t('owners.noPets') }}</p>
            <NuxtLink
              :to="`/pets/create?owner_id=${owner.id}`"
              class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm">
              <Icon name="mdi:plus" class="w-4 h-4" />
              {{ t('owners.addPet') }}
            </NuxtLink>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NuxtLink
              v-for="pet in pets"
              :key="pet.id"
              :to="`/pets/${pet.id}`"
              class="block p-4 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <div class="flex items-start gap-4">
                <div v-if="pet.photo_url" class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img :src="pet.photo_url" :alt="pet.name" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center flex-shrink-0">
                  <Icon name="mdi:paw" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-base font-bold text-gray-900 dark:text-white mb-1">{{ pet.name }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ pet.species }} - {{ pet.breed }}</p>
                  <div class="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-500">
                    <span class="flex items-center gap-1">
                      <Icon :name="pet.gender === 'male' ? 'mdi:gender-male' : 'mdi:gender-female'" class="w-3.5 h-3.5" />
                      {{ t(`pets.${pet.gender}`) }}
                    </span>
                    <span v-if="pet.age">{{ pet.age }} {{ t('pets.years') }}</span>
                    <span
                      :class="{
                        'text-emerald-600 dark:text-emerald-400': pet.status === 'active',
                        'text-gray-600 dark:text-gray-400': pet.status === 'inactive',
                        'text-red-600 dark:text-red-400': pet.status === 'deceased',
                      }"
                      class="font-semibold capitalize">
                      {{ t(`pets.status.${pet.status}`) }}
                    </span>
                  </div>
                </div>
                <Icon name="mdi:chevron-right" class="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Appointments -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="mdi:calendar-clock" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              {{ t('owners.recentAppointments') }}
            </h2>
            <NuxtLink
              :to="`/appointments?owner_id=${owner.id}`"
              class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold text-sm transition-colors">
              {{ t('common.viewAll') }}
            </NuxtLink>
          </div>

          <div v-if="loadingAppointments" class="text-center py-8">
            <Icon name="mdi:loading" class="w-8 h-8 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
          </div>

          <div v-else-if="appointments.length === 0" class="text-center py-8">
            <Icon name="mdi:calendar-blank" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p class="text-gray-500 dark:text-gray-400">{{ t('owners.noAppointments') }}</p>
          </div>

          <div v-else class="space-y-3">
            <NuxtLink
              v-for="appointment in appointments"
              :key="appointment.id"
              :to="`/appointments/${appointment.id}`"
              class="block p-4 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <Icon name="mdi:calendar" class="w-4 h-4 text-gray-400" />
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ formatDate(appointment.appointment_date) }} {{ t('appointments.at') }} {{ appointment.appointment_time || formatTime(appointment.appointment_date) }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 mb-1">
                    <Icon name="mdi:paw" class="w-4 h-4 text-gray-400" />
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ appointment.pet?.name }}</span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ appointment.reason }}</p>
                  <span
                    :class="{
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': appointment.status === 'confirmed',
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': appointment.status === 'pending',
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': appointment.status === 'completed',
                    }"
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mt-2 capitalize">
                    {{ t(`appointments.${appointment.status}`) }}
                  </span>
                </div>
                <Icon name="mdi:chevron-right" class="w-5 h-5 text-gray-400" />
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Invoices -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="mdi:receipt-text" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              {{ t('owners.recentInvoices') }}
            </h2>
            <NuxtLink
              :to="`/invoices?owner_id=${owner.id}`"
              class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold text-sm transition-colors">
              {{ t('common.viewAll') }}
            </NuxtLink>
          </div>

          <div v-if="loadingInvoices" class="text-center py-8">
            <Icon name="mdi:loading" class="w-8 h-8 animate-spin mx-auto text-indigo-600 dark:text-indigo-400" />
          </div>

          <div v-else-if="invoices.length === 0" class="text-center py-8">
            <Icon name="mdi:receipt-text-outline" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p class="text-gray-500 dark:text-gray-400">{{ t('owners.noInvoices') }}</p>
          </div>

          <div v-else class="space-y-3">
            <NuxtLink
              v-for="invoice in invoices"
              :key="invoice.id"
              :to="`/invoices/${invoice.id}`"
              class="block p-4 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-sm font-mono font-semibold text-indigo-600 dark:text-indigo-400">#{{ invoice.invoice_number }}</span>
                    <span
                      :class="{
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': invoice.status === 'paid',
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': invoice.status === 'pending',
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': invoice.status === 'overdue',
                      }"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize">
                      {{ t(`invoices.${invoice.status}`) }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Icon name="mdi:calendar" class="w-4 h-4" />
                    <span>{{ formatDate(invoice.invoice_date || invoice.issue_date || invoice.created_at) }}</span>
                  </div>
                  <p class="text-base font-bold text-gray-900 dark:text-white mt-2">${{ invoice.total_amount || invoice.total || 0 }}</p>
                </div>
                <Icon name="mdi:chevron-right" class="w-5 h-5 text-gray-400" />
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Statistics Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:chart-box" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {{ t('owners.statistics') }}
          </h2>

          <div class="space-y-4">
            <div class="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-purple-600 dark:text-purple-400 mb-1">{{ t('owners.totalPets') }}</p>
                  <p class="text-2xl font-bold text-purple-900 dark:text-purple-100">{{ stats.total_pets }}</p>
                </div>
                <Icon name="mdi:paw" class="w-10 h-10 text-purple-600 dark:text-purple-400 opacity-50" />
              </div>
            </div>

            <div class="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-blue-600 dark:text-blue-400 mb-1">{{ t('owners.totalAppointments') }}</p>
                  <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ stats.total_appointments }}</p>
                </div>
                <Icon name="mdi:calendar-check" class="w-10 h-10 text-blue-600 dark:text-blue-400 opacity-50" />
              </div>
            </div>

            <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-emerald-600 dark:text-emerald-400 mb-1">{{ t('owners.totalSpent') }}</p>
                  <p class="text-2xl font-bold text-emerald-900 dark:text-emerald-100">${{ stats.total_spent || 0 }}</p>
                </div>
                <Icon name="mdi:currency-usd" class="w-10 h-10 text-emerald-600 dark:text-emerald-400 opacity-50" />
              </div>
            </div>

            <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-amber-600 dark:text-amber-400 mb-1">{{ t('owners.pendingBalance') }}</p>
                  <p class="text-2xl font-bold text-amber-900 dark:text-amber-100">${{ stats.pending_balance || 0 }}</p>
                </div>
                <Icon name="mdi:clock-alert" class="w-10 h-10 text-amber-600 dark:text-amber-400 opacity-50" />
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon name="mdi:flash" class="w-6 h-6 text-amber-600 dark:text-amber-400" />
            {{ t('appointments.quickActions') }}
          </h2>

          <div class="space-y-3">
            <NuxtLink
              :to="`/appointments/create?owner_id=${owner.id}`"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:calendar-plus" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('owners.bookAppointment') }}</span>
            </NuxtLink>

            <NuxtLink
              :to="`/pets/create?owner_id=${owner.id}`"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:paw-plus" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('owners.addPet') }}</span>
            </NuxtLink>

            <NuxtLink
              :to="`/invoices/create?owner_id=${owner.id}`"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:receipt-text-plus" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('owners.createInvoice') }}</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Timeline -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon name="mdi:history" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            {{ t('appointments.timeline') }}
          </h2>

          <div class="space-y-3 text-sm">
            <div class="flex items-start gap-3">
              <Icon name="mdi:account-plus" class="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p class="text-gray-600 dark:text-gray-400">{{ t('owners.memberSince') }}</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatDate(owner.created_at) }}</p>
              </div>
            </div>
            <div v-if="owner.updated_at !== owner.created_at" class="flex items-start gap-3">
              <Icon name="mdi:update" class="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p class="text-gray-600 dark:text-gray-400">{{ t('appointments.lastUpdated') }}</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatDateTime(owner.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-16 text-center border border-gray-100 dark:border-zinc-800">
      <Icon name="mdi:alert-circle" class="w-24 h-24 mx-auto text-red-300 dark:text-red-600 mb-4" />
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ t('owners.ownerNotFound') }}</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">{{ t('owners.ownerNotFoundDesc') }}</p>
      <NuxtLink
        to="/owners"
        class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
        <Icon name="mdi:arrow-left" class="w-5 h-5" />
        {{ t('owners.backToOwners') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Owner, Pet, Appointment, Invoice } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { $apiService } = useNuxtApp()
const { handleError } = useErrorHandler()

const loading = ref(true)
const loadingPets = ref(true)
const loadingAppointments = ref(true)
const loadingInvoices = ref(true)
const owner = ref<Owner | null>(null)
const pets = ref<Pet[]>([])
const appointments = ref<Appointment[]>([])
const invoices = ref<Invoice[]>([])
const stats = ref({
  total_pets: 0,
  total_appointments: 0,
  total_spent: 0,
  pending_balance: 0
})

const fetchOwner = async () => {
  loading.value = true
  try {
    const response = await $apiService.owners.getById(Number(route.params.id))
    owner.value = response.data || response
  } catch (error) {
    console.error('Error fetching owner:', handleError(error))
  } finally {
    loading.value = false
  }
}

const fetchPets = async () => {
  loadingPets.value = true
  try {
    const response = await $apiService.pets.getAll({
      user_id: Number(route.params.id),
      per_page: 100
    })
    pets.value = response.data
    stats.value.total_pets = response.data.length
  } catch (error) {
    console.error('Error fetching pets:', handleError(error))
  } finally {
    loadingPets.value = false
  }
}

const fetchAppointments = async () => {
  loadingAppointments.value = true
  try {
    const response = await $apiService.appointments.getAll({
      user_id: Number(route.params.id),
      per_page: 5
    })
    appointments.value = response.data
    stats.value.total_appointments = response.total || response.data.length
  } catch (error) {
    console.error('Error fetching appointments:', handleError(error))
  } finally {
    loadingAppointments.value = false
  }
}

const fetchInvoices = async () => {
  loadingInvoices.value = true
  try {
    const response = await $apiService.invoices.getAll({
      // @ts-expect-error - user_id is valid for filtering but not in type definition
      user_id: Number(route.params.id),
      per_page: 5
    })
    invoices.value = response.data
    
    // Calculate totals
    const paidInvoices = response.data.filter((inv: Invoice) => inv.status === 'paid')
    const pendingInvoices = response.data.filter((inv: Invoice) => ['pending', 'overdue'].includes(inv.status || ''))
    
    stats.value.total_spent = paidInvoices.reduce((sum: number, inv: Invoice) => 
      sum + (parseFloat(String(inv.total_amount || inv.total || 0))), 0
    )
    stats.value.pending_balance = pendingInvoices.reduce((sum: number, inv: Invoice) => 
      sum + (parseFloat(String(inv.total_amount || inv.total || 0))), 0
    )
  } catch (error) {
    console.error('Error fetching invoices:', handleError(error))
  } finally {
    loadingInvoices.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchOwner()
  fetchPets()
  fetchAppointments()
  fetchInvoices()
})
</script>
