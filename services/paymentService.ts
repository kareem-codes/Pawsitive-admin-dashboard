import type { AxiosInstance } from 'axios'

export interface Payment {
  id: number
  invoice_id: number
  payment_number: string
  amount: number
  payment_method: string
  payment_date: string
  transaction_reference?: string
  received_by: number
  status: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export class PaymentService {
  constructor(private api: AxiosInstance) {}

  async getAll(params?: any): Promise<PaginatedResponse<Payment>> {
    const response = await this.api.get('/payments', { params })
    return response.data
  }

  async getById(id: number): Promise<ApiResponse<Payment>> {
    const response = await this.api.get(`/payments/${id}`)
    return response.data
  }

  async create(data: Partial<Payment>): Promise<ApiResponse<Payment>> {
    const response = await this.api.post('/payments', data)
    return response.data
  }

  async update(id: number, data: Partial<Payment>): Promise<ApiResponse<Payment>> {
    const response = await this.api.put(`/payments/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/payments/${id}`)
    return response.data
  }
}
