import type { AxiosInstance } from 'axios'
import type { Owner, PaginatedResponse, ApiResponse } from '~/types'

export class OwnerService {
  private api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.api = api
  }

  async getAll(params?: {
    page?: number
    per_page?: number
    search?: string
  }): Promise<PaginatedResponse<Owner>> {
    const response = await this.api.get('/owners', { params })
    return response.data
  }

  async getById(id: number): Promise<ApiResponse<Owner>> {
    const response = await this.api.get(`/owners/${id}`)
    return response.data
  }

  async create(data: Partial<Owner>): Promise<ApiResponse<Owner>> {
    const response = await this.api.post('/owners', data)
    return response.data
  }

  async update(id: number, data: Partial<Owner>): Promise<ApiResponse<Owner>> {
    const response = await this.api.put(`/owners/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/owners/${id}`)
    return response.data
  }

  async getStatistics(id: number): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/owners/${id}/statistics`)
    return response.data
  }

  async updateEmergencyContact(id: number, data: any): Promise<ApiResponse<Owner>> {
    const response = await this.api.put(`/owners/${id}/emergency-contact`, data)
    return response.data
  }
}
