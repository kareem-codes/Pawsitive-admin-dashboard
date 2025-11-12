import type { AxiosInstance } from 'axios'

export interface Setting {
  key: string
  value: any
  type: 'string' | 'integer' | 'float' | 'boolean' | 'json' | 'array'
  group: string
  description?: string
}

export interface SettingBatchUpdate {
  key: string
  value: any
  type: 'string' | 'integer' | 'float' | 'boolean' | 'json' | 'array'
}

export interface ApiResponse<T> {
  data?: T
  message?: string
}

export class SettingsService {
  private api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.api = api
  }

  async getAll(group?: string): Promise<Record<string, any>> {
    const params = group ? { group } : {}
    const response = await this.api.get('/settings', { params })
    return response.data
  }

  async getByKey(key: string): Promise<Setting> {
    const response = await this.api.get(`/settings/${key}`)
    return response.data
  }

  async create(data: {
    key: string
    value: any
    type: 'string' | 'integer' | 'float' | 'boolean' | 'json' | 'array'
    group?: string
    description?: string
  }): Promise<ApiResponse<Setting>> {
    const response = await this.api.post('/settings', data)
    return response.data
  }

  async updateBatch(settings: SettingBatchUpdate[]): Promise<ApiResponse<void>> {
    const response = await this.api.post('/settings/batch', { settings })
    return response.data
  }

  async delete(key: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/settings/${key}`)
    return response.data
  }

  async getGroups(): Promise<string[]> {
    const response = await this.api.get('/settings/groups')
    return response.data
  }
}
