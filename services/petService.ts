import type { AxiosInstance } from 'axios'
import type { Pet, PaginatedResponse, ApiResponse } from '~/types'

export class PetService {
  private api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.api = api
  }

  async getAll(params?: {
    page?: number
    per_page?: number
    species?: string
    user_id?: number
    owner_id?: number // Alias for user_id
    search?: string
    status?: string
  }): Promise<PaginatedResponse<Pet>> {
    const response = await this.api.get('/pets', { params })
    return response.data
  }

  async getById(id: number): Promise<ApiResponse<Pet>> {
    const response = await this.api.get(`/pets/${id}`)
    return response.data
  }

  async create(data: Partial<Pet> | FormData): Promise<ApiResponse<Pet>> {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
    const response = await this.api.post('/pets', data, { headers })
    return response.data
  }

  async update(id: number, data: Partial<Pet> | FormData): Promise<ApiResponse<Pet>> {
    if (data instanceof FormData) {
      // Laravel requires _method field for PUT with FormData
      data.append('_method', 'PUT')
      const response = await this.api.post(`/pets/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    }
    const response = await this.api.put(`/pets/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/pets/${id}`)
    return response.data
  }

  async uploadImage(id: number, file: File): Promise<ApiResponse<{ image_url: string }>> {
    const formData = new FormData()
    formData.append('photo', file)
    const response = await this.api.post(`/pets/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }

  async deleteImage(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/pets/${id}/photo`)
    return response.data
  }

  async getWeightRecords(id: number): Promise<ApiResponse<any[]>> {
    const response = await this.api.get(`/pets/${id}/weight`)
    return response.data
  }

  async addWeightRecord(id: number, data: any): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/pets/${id}/weight`, data)
    return response.data
  }
}
