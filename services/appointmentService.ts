import type { AxiosInstance } from 'axios'
import type { Appointment, PaginatedResponse, ApiResponse } from '~/types'

export class AppointmentService {
  private api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.api = api
  }

  async getAll(params?: {
    page?: number
    per_page?: number
    status?: string
    date?: string
    pet_id?: number
    user_id?: number
    veterinarian_id?: number
    search?: string
  }): Promise<PaginatedResponse<Appointment>> {
    const response = await this.api.get('/appointments', { params })
    return response.data
  }

  async getById(id: number): Promise<ApiResponse<Appointment>> {
    const response = await this.api.get(`/appointments/${id}`)
    return response.data
  }

  async create(data: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    const response = await this.api.post('/appointments', data)
    return response.data
  }

  async update(id: number, data: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    const response = await this.api.put(`/appointments/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/appointments/${id}`)
    return response.data
  }

  async updateStatus(id: number, status: string): Promise<ApiResponse<Appointment>> {
    // Using update method since backend doesn't have dedicated status endpoint
    const response = await this.api.put(`/appointments/${id}`, { status })
    return response.data
  }

  async confirm(id: number): Promise<ApiResponse<Appointment>> {
    const response = await this.api.post(`/appointments/${id}/confirm`)
    return response.data
  }

  async start(id: number): Promise<ApiResponse<Appointment>> {
    const response = await this.api.post(`/appointments/${id}/start`)
    return response.data
  }

  async complete(id: number): Promise<ApiResponse<Appointment>> {
    const response = await this.api.post(`/appointments/${id}/complete`)
    return response.data
  }

  async cancel(id: number): Promise<ApiResponse<Appointment>> {
    const response = await this.api.post(`/appointments/${id}/cancel`)
    return response.data
  }

  async noShow(id: number): Promise<ApiResponse<Appointment>> {
    const response = await this.api.post(`/appointments/${id}/no-show`)
    return response.data
  }

  async getTodayAppointments(): Promise<ApiResponse<Appointment[]>> {
    const response = await this.api.get('/dashboard/appointments/today')
    return response.data
  }

  async getAvailableSlots(date?: string): Promise<ApiResponse<string[]>> {
    const response = await this.api.get('/appointments/slots/available', { params: { date } })
    return response.data
  }

  async checkSlotAvailability(date: string, time: string): Promise<ApiResponse<{ available: boolean }>> {
    const response = await this.api.post('/appointments/slots/check', { date, time })
    return response.data
  }
}
