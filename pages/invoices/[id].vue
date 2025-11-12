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
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
            <Icon name="mdi:receipt-text" class="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {{ invoice?.invoice_number || t('invoices.title') }}
            </h1>
            <p v-if="invoice" class="text-gray-600 dark:text-gray-400 mt-1">
              {{ t('invoices.invoiceDetails') }}
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            v-if="invoice && invoice.status !== 'paid'"
            @click="showPaymentModal = true"
            class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold">
            <Icon name="mdi:cash" class="w-5 h-5" />
            {{ t('invoices.recordPayment') }}
          </button>
          <button
            v-if="invoice"
            @click="downloadPDF"
            class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold">
            <Icon name="mdi:file-pdf-box" class="w-5 h-5" />
            {{ t('invoices.downloadPdf') }}
          </button>
          <NuxtLink
            v-if="invoice"
            :to="`/invoices/create?id=${route.params.id}`"
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

    <!-- Invoice Details -->
    <div v-else-if="invoice" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Invoice Header Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-zinc-800">
          <div class="flex items-start justify-between mb-8">
            <div>
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ t('invoices.title') }}</h2>
              <p class="text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ invoice.invoice_number }}</p>
            </div>
            <span
              :class="{
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': invoice.status === 'paid',
                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': invoice.status === 'pending',
                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': invoice.status === 'partially_paid',
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': invoice.status === 'overdue',
                'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400': invoice.status === 'draft' || invoice.status === 'cancelled',
              }"
              class="px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide">
              {{ t(`invoices.${invoice.status}`) }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                {{ t('invoices.billedTo') }}
              </h3>
              <div v-if="invoice.owner" class="space-y-2">
                <p class="text-lg font-bold text-gray-900 dark:text-white">{{ invoice.owner.name }}</p>
                <p v-if="invoice.owner.email" class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Icon name="mdi:email" class="w-4 h-4" />
                  {{ invoice.owner.email }}
                </p>
                <p v-if="invoice.owner.phone" class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Icon name="mdi:phone" class="w-4 h-4" />
                  {{ invoice.owner.phone }}
                </p>
                <p v-if="invoice.owner.address" class="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                  <Icon name="mdi:map-marker" class="w-4 h-4 mt-0.5" />
                  <span>{{ invoice.owner.address }}{{ invoice.owner.city ? `, ${invoice.owner.city}` : '' }}</span>
                </p>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                {{ t('invoices.invoiceInformation') }}
              </h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('invoices.invoiceDate') }}:</span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatDate(invoice.invoice_date || invoice.issue_date || invoice.created_at) }}</span>
                </div>
                <div v-if="invoice.due_date" class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('invoices.dueDate') }}:</span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatDate(invoice.due_date) }}</span>
                </div>
                <div v-if="invoice.payment_date" class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('invoices.paymentDate') }}:</span>
                  <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{{ formatDate(invoice.payment_date) }}</span>
                </div>
                <div v-if="invoice.payment_method" class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('invoices.paymentMethod') }}:</span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white capitalize">{{ invoice.payment_method }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="invoice.pet" class="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
            <div class="flex items-center gap-3">
              <Icon name="mdi:paw" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <div>
                <p class="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide">{{ t('invoices.relatedPet') }}</p>
                <p class="text-base font-bold text-purple-900 dark:text-purple-100">{{ invoice.pet.name }} - {{ invoice.pet.species }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Invoice Items Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:format-list-bulleted" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {{ t('invoices.items') }}
          </h2>

          <div v-if="invoice.items && invoice.items.length > 0" class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-zinc-700">
                  <th class="text-left py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">{{ t('invoices.itemName') }}</th>
                  <th class="text-left py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">{{ t('common.description') }}</th>
                  <th class="text-right py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">{{ t('invoices.qty') }}</th>
                  <th class="text-right py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">{{ t('invoices.unitPrice') }}</th>
                  <th class="text-right py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">{{ t('invoices.itemTotal') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in invoice.items"
                  :key="item.id || index"
                  class="border-b border-gray-100 dark:border-zinc-800 last:border-0">
                  <td class="py-4 px-2">
                    <p class="font-semibold text-gray-900 dark:text-white">{{ item.product?.name || item.description }}</p>
                  </td>
                  <td class="py-4 px-2">
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.description }}</p>
                  </td>
                  <td class="py-4 px-2 text-right">
                    <p class="text-gray-900 dark:text-white">{{ item.quantity }}</p>
                  </td>
                  <td class="py-4 px-2 text-right">
                    <p class="text-gray-900 dark:text-white">${{ item.unit_price.toFixed(2) }}</p>
                  </td>
                  <td class="py-4 px-2 text-right">
                    <p class="font-semibold text-gray-900 dark:text-white">${{ item.total.toFixed(2) }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="text-center py-8">
            <Icon name="mdi:inbox" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p class="text-gray-500 dark:text-gray-400">{{ t('invoices.noItems') }}</p>
          </div>

          <!-- Totals -->
          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-zinc-700">
            <div class="max-w-sm ml-auto space-y-3">
              <div class="flex justify-between text-base">
                <span class="text-gray-600 dark:text-gray-400">{{ t('invoices.subtotal') }}:</span>
                <span class="font-semibold text-gray-900 dark:text-white">${{ (invoice.subtotal || 0).toFixed(2) }}</span>
              </div>
              <div v-if="invoice.tax || invoice.tax_amount" class="flex justify-between text-base">
                <span class="text-gray-600 dark:text-gray-400">{{ t('invoices.tax') }}:</span>
                <span class="font-semibold text-gray-900 dark:text-white">${{ (invoice.tax || invoice.tax_amount || 0).toFixed(2) }}</span>
              </div>
              <div v-if="invoice.discount || invoice.discount_amount" class="flex justify-between text-base text-red-600 dark:text-red-400">
                <span>{{ t('invoices.discount') }}:</span>
                <span class="font-semibold">-${{ (invoice.discount || invoice.discount_amount || 0).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-xl font-bold pt-3 border-t border-gray-200 dark:border-zinc-700">
                <span class="text-gray-900 dark:text-white">{{ t('invoices.total') }}:</span>
                <span class="text-emerald-600 dark:text-emerald-400">${{ (invoice.total || invoice.total_amount || 0).toFixed(2) }}</span>
              </div>
              <div v-if="invoice.paid_amount" class="flex justify-between text-base">
                <span class="text-gray-600 dark:text-gray-400">{{ t('invoices.paidAmount') }}:</span>
                <span class="font-semibold text-emerald-600 dark:text-emerald-400">${{ (invoice.paid_amount || 0).toFixed(2) }}</span>
              </div>
              <div v-if="invoice.paid_amount && invoice.paid_amount < (invoice.total || invoice.total_amount || 0)" class="flex justify-between text-lg font-bold text-red-600 dark:text-red-400">
                <span>{{ t('invoices.balanceDue') }}:</span>
                <span>${{ ((invoice.total || invoice.total_amount || 0) - (invoice.paid_amount || 0)).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes Card -->
        <div v-if="invoice.notes" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:note-text" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            {{ t('common.notes') }}
          </h2>

          <div class="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
            <p class="text-base text-gray-900 dark:text-white whitespace-pre-wrap">{{ invoice.notes }}</p>
          </div>
        </div>

        <!-- Related Appointment -->
        <div v-if="invoice.appointment" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:calendar-check" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            {{ t('invoices.relatedAppointment') }}
          </h2>

          <NuxtLink
            :to="`/appointments/${invoice.appointment.id}`"
            class="block p-4 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <Icon name="mdi:calendar" class="w-4 h-4 text-gray-400" />
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ formatDate(invoice.appointment.appointment_date) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ invoice.appointment.reason }}</p>
                <span
                  :class="{
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': invoice.appointment.status === 'completed',
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': invoice.appointment.status === 'confirmed',
                  }"
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold capitalize">
                  {{ t(`appointments.${invoice.appointment.status}`) }}
                </span>
              </div>
              <Icon name="mdi:chevron-right" class="w-5 h-5 text-gray-400" />
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Payment Status Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:cash-multiple" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            {{ t('invoices.paymentStatus') }}
          </h2>

          <div class="space-y-4">
            <div class="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
              <p class="text-sm text-emerald-600 dark:text-emerald-400 mb-1">{{ t('invoices.totalAmount') }}</p>
              <p class="text-3xl font-bold text-emerald-900 dark:text-emerald-100">${{ (invoice.total || invoice.total_amount || 0) }}</p>
            </div>

            <div v-if="invoice.paid_amount" class="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
              <p class="text-sm text-blue-600 dark:text-blue-400 mb-1">{{ t('invoices.amountPaid') }}</p>
              <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">${{ (invoice.paid_amount || 0) }}</p>
            </div>

            <div v-if="invoice.paid_amount && invoice.paid_amount < (invoice.total || invoice.total_amount || 0)" class="p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800">
              <p class="text-sm text-red-600 dark:text-red-400 mb-1">{{ t('invoices.balanceDue') }}</p>
              <p class="text-2xl font-bold text-red-900 dark:text-red-100">${{ ((invoice.total || invoice.total_amount || 0) - (invoice.paid_amount || 0)) }}</p>
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
            <button
              v-if="invoice.status !== 'paid'"
              @click="showPaymentModal = true"
              class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:cash-check" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('invoices.recordPayment') }}</span>
            </button>

            <button
              @click="downloadPDF"
              class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:file-pdf-box" class="w-5 h-5 text-red-600 dark:text-red-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('invoices.downloadPdf') }}</span>
            </button>

            <button
              @click="printInvoice"
              class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:printer" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('invoices.printInvoice') }}</span>
            </button>

            <button
              v-if="invoice.owner?.email"
              @click="sendInvoiceEmail"
              class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:email-send" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('invoices.sendEmail') }}</span>
            </button>

            <NuxtLink
              v-if="invoice.owner"
              :to="`/owners/${invoice.owner.id}`"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:account" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('invoices.viewClient') }}</span>
            </NuxtLink>

            <NuxtLink
              v-if="invoice.pet"
              :to="`/pets/${invoice.pet.id}`"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:paw" class="w-5 h-5 text-pink-600 dark:text-pink-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('invoices.viewPet') }}</span>
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
              <Icon name="mdi:file-document-plus" class="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p class="text-gray-600 dark:text-gray-400">{{ t('invoices.invoiceCreated') }}</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatDateTime(invoice.created_at) }}</p>
              </div>
            </div>
            <div v-if="invoice.updated_at !== invoice.created_at" class="flex items-start gap-3">
              <Icon name="mdi:update" class="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p class="text-gray-600 dark:text-gray-400">{{ t('appointments.lastUpdated') }}</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatDateTime(invoice.updated_at) }}</p>
              </div>
            </div>
            <div v-if="invoice.payment_date" class="flex items-start gap-3">
              <Icon name="mdi:cash-check" class="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p class="text-gray-600 dark:text-gray-400">{{ t('invoices.paymentReceived') }}</p>
                <p class="text-emerald-600 dark:text-emerald-400 font-medium">{{ formatDateTime(invoice.payment_date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-16 text-center border border-gray-100 dark:border-zinc-800">
      <Icon name="mdi:alert-circle" class="w-24 h-24 mx-auto text-red-300 dark:text-red-600 mb-4" />
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ t('invoices.invoiceNotFound') }}</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">{{ t('invoices.invoiceNotFoundDesc') }}</p>
      <NuxtLink
        to="/invoices"
        class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
        <Icon name="mdi:arrow-left" class="w-5 h-5" />
        {{ t('invoices.backToInvoices') }}
      </NuxtLink>
    </div>

    <!-- Payment Modal -->
    <div
      v-if="showPaymentModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showPaymentModal = false">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 max-w-md w-full border border-gray-100 dark:border-zinc-800">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ t('invoices.recordPayment') }}</h3>
          <button
            @click="showPaymentModal = false"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Icon name="mdi:close" class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="submitPayment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('invoices.paymentAmount') }}
            </label>
            <input
              v-model.number="paymentForm.amount"
              type="number"
              step="0.01"
              :max="(invoice?.total || invoice?.total_amount || 0) - (invoice?.paid_amount || 0)"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('invoices.paymentMethod') }}
            </label>
            <select
              v-model="paymentForm.method"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all"
              required>
              <option value="cash">{{ t('invoices.cash') }}</option>
              <option value="card">{{ t('invoices.card') }}</option>
              <option value="bank_transfer">{{ t('invoices.bankTransfer') }}</option>
              <option value="check">{{ t('invoices.check') }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('invoices.paymentDate') }}
            </label>
            <input
              v-model="paymentForm.date"
              type="date"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all"
              required />
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="showPaymentModal = false"
              class="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              {{ t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="submittingPayment"
              class="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Icon v-if="submittingPayment" name="mdi:loading" class="w-5 h-5 animate-spin" />
              {{ submittingPayment ? t('common.saving') : t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Invoice } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { $apiService } = useNuxtApp()
const { handleError } = useErrorHandler()

const loading = ref(true)
const invoice = ref<Invoice | null>(null)
const showPaymentModal = ref(false)
const submittingPayment = ref(false)

const paymentForm = ref({
  amount: 0,
  method: 'cash',
  date: new Date().toISOString().split('T')[0]
})

const fetchInvoice = async () => {
  loading.value = true
  try {
    const response = await $apiService.invoices.getById(Number(route.params.id))
    invoice.value = response
    
    // Set default payment amount to remaining balance
    if (invoice.value) {
      const total = invoice.value.total || invoice.value.total_amount || 0
      const paid = invoice.value.paid_amount || 0
      paymentForm.value.amount = total - paid
    }
  } catch (error) {
    console.error('Error fetching invoice:', handleError(error))
  } finally {
    loading.value = false
  }
}

const submitPayment = async () => {
  if (!invoice.value) return
  
  submittingPayment.value = true
  try {
    await $apiService.invoices.recordPayment(invoice.value.id, {
      amount: paymentForm.value.amount,
      payment_method: paymentForm.value.method,
      payment_date: paymentForm.value.date
    })
    
    showPaymentModal.value = false
    await fetchInvoice() // Refresh invoice data
  } catch (error) {
    console.error('Error recording payment:', handleError(error))
  } finally {
    submittingPayment.value = false
  }
}

const downloadPDF = async () => {
  if (!invoice.value) return
  
  try {
    // TODO: Implement PDF download
    console.log('Download PDF for invoice:', invoice.value.id)
  } catch (error) {
    console.error('Error downloading PDF:', handleError(error))
  }
}

const printInvoice = () => {
  window.print()
}

const sendInvoiceEmail = async () => {
  if (!invoice.value) return
  
  try {
    // TODO: Implement email sending
    console.log('Send email for invoice:', invoice.value.id)
  } catch (error) {
    console.error('Error sending email:', handleError(error))
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
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
  fetchInvoice()
})
</script>
