import type { AxiosInstance } from 'axios'
import type { DashboardStats, Activity, ApiResponse } from '~/types'

export class DashboardService {
  private api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.api = api
  }

  async getStats(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/dashboard')
    return response.data
  }

  async getTodayAppointments(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/dashboard/appointments/today')
    return response.data
  }

  async getUpcomingVaccinations(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/dashboard/vaccinations/upcoming')
    return response.data
  }

  async getOverdueVaccinations(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/dashboard/vaccinations/overdue')
    return response.data
  }

  async getRecentActivity(limit: number = 10): Promise<ApiResponse<Activity[]>> {
    // Using audit logs to get recent activity
    const response = await this.api.get('/audit-logs', { 
      params: { 
        per_page: limit,
        page: 1
      } 
    })
    
    // Transform audit logs to activity format
    const activities = response.data.data?.map((log: any) => ({
      id: log.id,
      type: log.action,
      description: `${log.action} on ${log.auditable_type}`,
      icon: this.getActivityIcon(log.action),
      timestamp: log.created_at,
      user: log.user?.name
    })) || []
    
    return {
      success: true,
      data: activities
    }
  }

  private getActivityIcon(action: string): string {
    const iconMap: Record<string, string> = {
      'created': 'mdi:plus-circle',
      'updated': 'mdi:pencil',
      'deleted': 'mdi:delete',
      'login': 'mdi:login',
      'logout': 'mdi:logout',
      'payment': 'mdi:currency-usd',
      'appointment': 'mdi:calendar-clock',
      'invoice': 'mdi:receipt'
    }
    return iconMap[action.toLowerCase()] || 'mdi:information'
  }

  async getRevenueData(params?: any): Promise<ApiResponse<any>> {
    const response = await this.api.get('/dashboard/revenue', { params })
    return response.data
  }
}
