import type { AxiosInstance } from 'axios'
import type { MedicalRecord, PaginatedResponse, ApiResponse } from '~/types'

export class MedicalRecordService {
  private api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.api = api
  }

  async getAll(params?: {
    page?: number
    per_page?: number
    pet_id?: number
    veterinarian_id?: number
    search?: string
  }): Promise<PaginatedResponse<MedicalRecord>> {
    const response = await this.api.get('/medical-records', { params })
    return response.data
  }

  async getById(id: number): Promise<ApiResponse<MedicalRecord>> {
    const response = await this.api.get(`/medical-records/${id}`)
    return response.data
  }

  async create(data: Partial<MedicalRecord>): Promise<ApiResponse<MedicalRecord>> {
    const response = await this.api.post('/medical-records', data)
    return response.data
  }

  async update(id: number, data: Partial<MedicalRecord>): Promise<ApiResponse<MedicalRecord>> {
    const response = await this.api.put(`/medical-records/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/medical-records/${id}`)
    return response.data
  }

  async uploadDocument(file: File, data: {
    pet_id: number
    medical_record_id?: number
    document_type?: string
    notes?: string
  }): Promise<ApiResponse<any>> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('entity_type', 'medical_record')
    formData.append('entity_id', data.medical_record_id?.toString() || '')
    if (data.document_type) formData.append('document_type', data.document_type)
    if (data.notes) formData.append('notes', data.notes)
    
    const response = await this.api.post(`/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
}
