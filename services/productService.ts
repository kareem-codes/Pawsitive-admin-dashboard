import type { AxiosInstance } from 'axios'
import type { Product, PaginatedResponse, ApiResponse } from '~/types'

export class ProductService {
  private api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.api = api
  }

  async getAll(params?: {
    page?: number
    per_page?: number
    category?: string
    status?: string
    search?: string
    low_stock?: boolean
  }): Promise<PaginatedResponse<Product>> {
    const response = await this.api.get('/products', { params })
    return response.data
  }

  async getById(id: number): Promise<ApiResponse<Product>> {
    const response = await this.api.get(`/products/${id}`)
    return response.data
  }

  async create(data: Partial<Product> | FormData): Promise<ApiResponse<Product>> {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
    const response = await this.api.post('/products', data, { headers })
    return response.data
  }

  async update(id: number, data: Partial<Product> | FormData): Promise<ApiResponse<Product>> {
    if (data instanceof FormData) {
      // Laravel requires _method field for PUT with FormData
      data.append('_method', 'PUT')
      const response = await this.api.post(`/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    }
    const response = await this.api.put(`/products/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/products/${id}`)
    return response.data
  }

  async addStock(id: number, quantity: number, notes?: string): Promise<ApiResponse<Product>> {
    const response = await this.api.post(`/products/${id}/stock/add`, { quantity, notes })
    return response.data
  }

  async removeStock(id: number, quantity: number, notes?: string): Promise<ApiResponse<Product>> {
    const response = await this.api.post(`/products/${id}/stock/remove`, { quantity, notes })
    return response.data
  }

  async adjustStock(id: number, quantity: number, notes?: string): Promise<ApiResponse<Product>> {
    const response = await this.api.post(`/products/${id}/stock/adjust`, { quantity, notes })
    return response.data
  }

  async getStockHistory(id: number): Promise<ApiResponse<any[]>> {
    const response = await this.api.get(`/products/${id}/stock/history`)
    return response.data
  }

  async getLowStock(): Promise<ApiResponse<Product[]>> {
    const response = await this.api.get('/stock/low-stock')
    return response.data
  }
}
