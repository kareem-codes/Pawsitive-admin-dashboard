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
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
            <Icon name="mdi:package-variant" class="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {{ product?.name || t('products.title') }}
            </h1>
            <p v-if="product" class="text-gray-600 dark:text-gray-400 mt-1">
              {{ t('products.productDetails') }}
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <NuxtLink
            v-if="product"
            :to="`/products/create?id=${route.params.id}`"
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

    <!-- Product Details -->
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Product Image & Basic Info Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Product Image -->
            <div class="w-full md:w-48 h-48 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                v-if="product.image_url || product.image"
                :src="product.image_url || product.image"
                :alt="product.name"
                class="w-full h-full object-cover" />
              <Icon
                v-else
                name="mdi:package-variant"
                class="w-24 h-24 text-gray-400 dark:text-gray-500" />
            </div>

            <!-- Basic Info -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ product.name }}</h2>
                  <span
                    :class="{
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': product.status === 'active',
                      'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400': product.status === 'inactive',
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': product.status === 'discontinued',
                    }"
                    class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {{ t(`products.${product.status}`) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {{ t('products.category') }}
                  </label>
                  <p class="text-base font-semibold text-gray-900 dark:text-white capitalize">
                    {{ t(`products.${product.category}`) }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {{ t('products.sku') }}
                  </label>
                  <p class="text-base font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {{ product.sku }}
                  </p>
                </div>

                <div v-if="product.barcode">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {{ t('products.barcode') }}
                  </label>
                  <p class="text-base font-mono font-semibold text-gray-900 dark:text-white">
                    {{ product.barcode }}
                  </p>
                </div>

                <div v-if="product.unit">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {{ t('products.unit') }}
                  </label>
                  <p class="text-base font-semibold text-gray-900 dark:text-white capitalize">
                    {{ product.unit }}
                  </p>
                </div>
              </div>

              <div v-if="product.description">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {{ t('common.description') }}
                </label>
                <p class="text-base text-gray-900 dark:text-white">{{ product.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing Information Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:cash-multiple" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            {{ t('products.pricingInformation') }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
              <p class="text-sm text-emerald-600 dark:text-emerald-400 mb-1">{{ t('products.sellingPrice') }}</p>
              <p class="text-3xl font-bold text-emerald-900 dark:text-emerald-100">${{ product.price }}</p>
            </div>

            <div v-if="product.cost || product.cost_price" class="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
              <p class="text-sm text-blue-600 dark:text-blue-400 mb-1">{{ t('products.costPrice') }}</p>
              <p class="text-3xl font-bold text-blue-900 dark:text-blue-100">${{ (product.cost || product.cost_price || 0) }}</p>
            </div>

            <div v-if="product.cost || product.cost_price" class="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
              <p class="text-sm text-amber-600 dark:text-amber-400 mb-1">{{ t('products.profitMargin') }}</p>
              <p class="text-3xl font-bold text-amber-900 dark:text-amber-100">
                {{ calculateProfitMargin(product.price, product.cost || product.cost_price || 0) }}%
              </p>
            </div>
          </div>

          <div v-if="product.tax_percentage || product.tax_fixed" class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="product.tax_percentage">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('products.taxPercentage') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white">{{ product.tax_percentage }}%</p>
            </div>

            <div v-if="product.tax_fixed">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('products.taxFixed') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white">${{ product.tax_fixed }}</p>
            </div>
          </div>
        </div>

        <!-- Stock Information Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:package-variant-closed" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            {{ t('products.stockInformation') }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
              <p class="text-sm text-purple-600 dark:text-purple-400 mb-1">{{ t('products.currentStock') }}</p>
              <p class="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {{ product.stock_quantity || product.quantity_in_stock || 0 }}
              </p>
              <p class="text-xs text-purple-600 dark:text-purple-400 mt-1">
                {{ getStockStatus(product.stock_quantity || product.quantity_in_stock || 0, product.min_stock_level) }}
              </p>
            </div>

            <div class="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800">
              <p class="text-sm text-orange-600 dark:text-orange-400 mb-1">{{ t('products.minimumStock') }}</p>
              <p class="text-3xl font-bold text-orange-900 dark:text-orange-100">{{ product.min_stock_level }}</p>
            </div>

            <div v-if="product.reorder_threshold" class="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800">
              <p class="text-sm text-yellow-600 dark:text-yellow-400 mb-1">{{ t('products.reorderLevel') }}</p>
              <p class="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{{ product.reorder_threshold }}</p>
            </div>
          </div>

          <div v-if="needsReorder" class="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div class="flex items-center gap-3">
              <Icon name="mdi:alert" class="w-6 h-6 text-red-600 dark:text-red-400" />
              <div>
                <p class="text-sm font-semibold text-red-900 dark:text-red-100">{{ t('products.lowStockAlert') }}</p>
                <p class="text-sm text-red-700 dark:text-red-300">{{ t('products.lowStockMessage') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Information Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:information" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            {{ t('products.additionalInformation') }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="product.supplier">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('products.supplier') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white">{{ product.supplier }}</p>
            </div>

            <div v-if="product.expiry_date">
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ t('products.expiryDate') }}
              </label>
              <p class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="mdi:calendar-alert" class="w-4 h-4 text-gray-400" />
                {{ formatDate(product.expiry_date) }}
              </p>
              <p v-if="isExpiringSoon(product.expiry_date)" class="text-sm text-amber-600 dark:text-amber-400 mt-1">
                {{ t('products.expiringSoon') }}
              </p>
              <p v-else-if="isExpired(product.expiry_date)" class="text-sm text-red-600 dark:text-red-400 mt-1">
                {{ t('products.expired') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Stock Status Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Icon name="mdi:chart-box" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            {{ t('products.stockStatus') }}
          </h2>

          <div class="space-y-4">
            <div
              :class="{
                'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800': !needsReorder && !isLowStock,
                'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800': isLowStock && !needsReorder,
                'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800': needsReorder,
              }"
              class="p-4 rounded-xl border">
              <div class="flex items-center justify-between">
                <div>
                  <p
                    :class="{
                      'text-emerald-600 dark:text-emerald-400': !needsReorder && !isLowStock,
                      'text-amber-600 dark:text-amber-400': isLowStock && !needsReorder,
                      'text-red-600 dark:text-red-400': needsReorder,
                    }"
                    class="text-sm mb-1">
                    {{ getStockStatus(product.stock_quantity || product.quantity_in_stock || 0, product.min_stock_level) }}
                  </p>
                  <p
                    :class="{
                      'text-emerald-900 dark:text-emerald-100': !needsReorder && !isLowStock,
                      'text-amber-900 dark:text-amber-100': isLowStock && !needsReorder,
                      'text-red-900 dark:text-red-100': needsReorder,
                    }"
                    class="text-2xl font-bold">
                    {{ product.stock_quantity || product.quantity_in_stock || 0 }} {{ t('products.units') }}
                  </p>
                </div>
                <Icon
                  :name="needsReorder ? 'mdi:alert-circle' : isLowStock ? 'mdi:alert' : 'mdi:check-circle'"
                  :class="{
                    'text-emerald-600 dark:text-emerald-400': !needsReorder && !isLowStock,
                    'text-amber-600 dark:text-amber-400': isLowStock && !needsReorder,
                    'text-red-600 dark:text-red-400': needsReorder,
                  }"
                  class="w-10 h-10 opacity-50" />
              </div>
            </div>

            <div class="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('products.stockValue') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                ${{ ((product.stock_quantity || product.quantity_in_stock || 0) * (product.cost || product.cost_price || 0)) }}
              </p>
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
              @click="showStockModal = true"
              class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:package-variant-plus" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('products.adjustStock') }}</span>
            </button>

            <button
              @click="showPriceModal = true"
              class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:cash-edit" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('products.updatePrice') }}</span>
            </button>

            <button
              @click="duplicateProduct"
              class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:content-copy" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('products.duplicate') }}</span>
            </button>

            <button
              @click="printLabel"
              class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Icon name="mdi:barcode" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span class="font-medium text-gray-900 dark:text-white">{{ t('products.printLabel') }}</span>
            </button>
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
              <Icon name="mdi:package-variant-plus" class="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p class="text-gray-600 dark:text-gray-400">{{ t('products.productAdded') }}</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatDateTime(product.created_at) }}</p>
              </div>
            </div>
            <div v-if="product.updated_at !== product.created_at" class="flex items-start gap-3">
              <Icon name="mdi:update" class="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p class="text-gray-600 dark:text-gray-400">{{ t('appointments.lastUpdated') }}</p>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatDateTime(product.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-16 text-center border border-gray-100 dark:border-zinc-800">
      <Icon name="mdi:alert-circle" class="w-24 h-24 mx-auto text-red-300 dark:text-red-600 mb-4" />
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ t('products.productNotFound') }}</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">{{ t('products.productNotFoundDesc') }}</p>
      <NuxtLink
        to="/products"
        class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
        <Icon name="mdi:arrow-left" class="w-5 h-5" />
        {{ t('products.backToProducts') }}
      </NuxtLink>
    </div>

    <!-- Stock Adjustment Modal -->
    <div
      v-if="showStockModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showStockModal = false">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 max-w-md w-full border border-gray-100 dark:border-zinc-800">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ t('products.adjustStock') }}</h3>
          <button
            @click="showStockModal = false"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Icon name="mdi:close" class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="submitStockAdjustment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.currentStock') }}
            </label>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ product?.stock_quantity || product?.quantity_in_stock || 0 }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.adjustmentType') }}
            </label>
            <select
              v-model="stockForm.type"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all"
              required>
              <option value="add">{{ t('products.addStock') }}</option>
              <option value="remove">{{ t('products.removeStock') }}</option>
              <option value="set">{{ t('products.setStock') }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.quantity') }}
            </label>
            <input
              v-model.number="stockForm.quantity"
              type="number"
              min="0"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.reason') }}
            </label>
            <textarea
              v-model="stockForm.reason"
              rows="3"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all"
              :placeholder="t('products.reasonPlaceholder')"></textarea>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="showStockModal = false"
              class="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              {{ t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="submittingStock"
              class="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Icon v-if="submittingStock" name="mdi:loading" class="w-5 h-5 animate-spin" />
              {{ submittingStock ? t('common.saving') : t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Price Update Modal -->
    <div
      v-if="showPriceModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showPriceModal = false">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 max-w-md w-full border border-gray-100 dark:border-zinc-800">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ t('products.updatePrice') }}</h3>
          <button
            @click="showPriceModal = false"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Icon name="mdi:close" class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="submitPriceUpdate" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.sellingPrice') }}
            </label>
            <input
              v-model.number="priceForm.price"
              type="number"
              step="0.01"
              min="0"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('products.costPrice') }}
            </label>
            <input
              v-model.number="priceForm.cost"
              type="number"
              step="0.01"
              min="0"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none transition-all" />
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="showPriceModal = false"
              class="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              {{ t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="submittingPrice"
              class="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Icon v-if="submittingPrice" name="mdi:loading" class="w-5 h-5 animate-spin" />
              {{ submittingPrice ? t('common.saving') : t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { $apiService } = useNuxtApp()
const { handleError } = useErrorHandler()

const loading = ref(true)
const product = ref<Product | null>(null)
const showStockModal = ref(false)
const showPriceModal = ref(false)
const submittingStock = ref(false)
const submittingPrice = ref(false)

const stockForm = ref({
  type: 'add',
  quantity: 0,
  reason: ''
})

const priceForm = ref({
  price: 0,
  cost: 0
})

const needsReorder = computed(() => {
  if (!product.value) return false
  const stock = product.value.stock_quantity || product.value.quantity_in_stock || 0
  const threshold = product.value.reorder_threshold || product.value.min_stock_level
  return stock <= threshold
})

const isLowStock = computed(() => {
  if (!product.value) return false
  const stock = product.value.stock_quantity || product.value.quantity_in_stock || 0
  return stock <= product.value.min_stock_level && stock > (product.value.reorder_threshold || 0)
})

const fetchProduct = async () => {
  loading.value = true
  try {
    const response = await $apiService.products.getById(Number(route.params.id))
    product.value = response
    
    // Set price form values
    if (product.value) {
      priceForm.value.price = product.value.price
      priceForm.value.cost = product.value.cost || product.value.cost_price || 0
    }
  } catch (error) {
    console.error('Error fetching product:', handleError(error))
  } finally {
    loading.value = false
  }
}

const submitStockAdjustment = async () => {
  if (!product.value) return
  
  submittingStock.value = true
  try {
    // Calculate new stock quantity
    let newStock = product.value.stock_quantity || product.value.quantity_in_stock || 0
    
    if (stockForm.value.type === 'add') {
      newStock += stockForm.value.quantity
    } else if (stockForm.value.type === 'remove') {
      newStock = Math.max(0, newStock - stockForm.value.quantity)
    } else if (stockForm.value.type === 'set') {
      newStock = stockForm.value.quantity
    }
    
    await $apiService.products.update(product.value.id, {
      stock_quantity: newStock
    })
    
    showStockModal.value = false
    await fetchProduct() // Refresh product data
  } catch (error) {
    console.error('Error adjusting stock:', handleError(error))
  } finally {
    submittingStock.value = false
  }
}

const submitPriceUpdate = async () => {
  if (!product.value) return
  
  submittingPrice.value = true
  try {
    await $apiService.products.update(product.value.id, priceForm.value)
    showPriceModal.value = false
    await fetchProduct() // Refresh product data
  } catch (error) {
    console.error('Error updating price:', handleError(error))
  } finally {
    submittingPrice.value = false
  }
}

const duplicateProduct = () => {
  if (!product.value) return
  router.push(`/products/create?duplicate=${product.value.id}`)
}

const printLabel = () => {
  window.print()
}

const calculateProfitMargin = (price: number, cost: number) => {
  if (cost === 0) return 0
    const margin = (((price - cost) / price) * 100)
  return margin?.toFixed(2)
}

const getStockStatus = (stock: number, minLevel: number) => {
  if (stock === 0) return t('products.outOfStock')
  if (stock <= minLevel) return t('products.lowStock')
  return t('products.inStock')
}

const isExpiringSoon = (expiryDate: string) => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return daysUntilExpiry > 0 && daysUntilExpiry <= 30
}

const isExpired = (expiryDate: string) => {
  return new Date(expiryDate) < new Date()
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
  fetchProduct()
})
</script>
