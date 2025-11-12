import type { AxiosInstance } from 'axios'

export interface RevenueReport {
  total_revenue: number
  pending_revenue: number
  total_invoices: number
  paid_invoices: number
  average_invoice_value: number
  by_period?: Array<{
    period: string
    revenue: number
    count: number
  }>
}

export interface AppointmentReport {
  total_appointments: number
  by_status: Record<string, number>
  by_type: Record<string, number>
  by_veterinarian: Array<{
    veterinarian: string
    count: number
  }>
  completion_rate: number
  no_show_rate: number
}

export interface PopularService {
  type: string
  count: number
}

export interface ServicesReport {
  popular_services: PopularService[]
}

export interface TopProduct {
  id: number
  name: string
  sku: string
  total_quantity: number
  total_revenue: number
}

export interface ProductSalesReport {
  top_selling_products: TopProduct[]
}

export interface ClientRetentionReport {
  total_clients: number
  active_clients: number
  returning_clients: number
  retention_rate: number
  return_rate: number
}

export interface PetsReport {
  total_pets: number
  by_species: Record<string, number>
}

export interface ReportFilters {
  from_date?: string
  to_date?: string
  group_by?: 'day' | 'week' | 'month' | 'year'
  limit?: number
}

export class ReportService {
  constructor(private api: AxiosInstance) {}

  async getRevenue(filters?: ReportFilters): Promise<RevenueReport> {
    const response = await this.api.get('/reports/revenue', { params: filters })
    return response.data
  }

  async getAppointments(filters?: ReportFilters): Promise<AppointmentReport> {
    const response = await this.api.get('/reports/appointments', { params: filters })
    return response.data
  }

  async getServices(filters?: ReportFilters): Promise<ServicesReport> {
    const response = await this.api.get('/reports/services', { params: filters })
    return response.data
  }

  async getProductSales(filters?: ReportFilters): Promise<ProductSalesReport> {
    const response = await this.api.get('/reports/product-sales', { params: filters })
    return response.data
  }

  async getClientRetention(filters?: ReportFilters): Promise<ClientRetentionReport> {
    const response = await this.api.get('/reports/client-retention', { params: filters })
    return response.data
  }

  async getPets(filters?: ReportFilters): Promise<PetsReport> {
    const response = await this.api.get('/reports/pets', { params: filters })
    return response.data
  }
}
