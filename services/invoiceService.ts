import type { AxiosInstance } from 'axios'
import type { Invoice, InvoiceItem, PaginatedResponse, ApiResponse } from '~/types'

export class InvoiceService {
  private api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.api = api
  }

  async getAll(params?: {
    page?: number
    per_page?: number
    status?: string
    owner_id?: number
    search?: string
    date_from?: string
    date_to?: string
  }): Promise<PaginatedResponse<Invoice>> {
    const response = await this.api.get('/invoices', { params })
    return response.data
  }

  async getById(id: number): Promise<ApiResponse<Invoice>> {
    const response = await this.api.get(`/invoices/${id}`)
    return response.data
  }

  async create(data: Partial<Invoice>): Promise<ApiResponse<Invoice>> {
    const response = await this.api.post('/invoices', data)
    return response.data
  }

  async update(id: number, data: Partial<Invoice>): Promise<ApiResponse<Invoice>> {
    const response = await this.api.put(`/invoices/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/invoices/${id}`)
    return response.data
  }

  async recordPayment(id: number, data: {
    amount: number
    payment_method: string
    payment_date?: string
    reference_number?: string
  }): Promise<ApiResponse<any>> {
    const response = await this.api.post(`/payments`, {
      invoice_id: id,
      ...data
    })
    return response.data
  }

  async downloadPdf(id: number): Promise<Blob> {
    const response = await this.api.get(`/invoices/${id}/pdf`, {
      responseType: 'blob'
    })
    return response.data
  }

  async previewPdf(id: number): Promise<Blob> {
    const response = await this.api.get(`/invoices/${id}/pdf/preview`, {
      responseType: 'blob'
    })
    return response.data
  }
}
