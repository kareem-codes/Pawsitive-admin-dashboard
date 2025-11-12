import { AppointmentService } from './appointmentService'
import { PetService } from './petService'
import { OwnerService } from './ownerService'
import { MedicalRecordService } from './medicalRecordService'
import { InvoiceService } from './invoiceService'
import { ProductService } from './productService'
import { DashboardService } from './dashboardService'
import { AuthService } from './authService'
import { ReportService } from './reportService'
import { SettingsService } from './settingsService'
import { PaymentService } from './paymentService'
import type { AxiosInstance } from 'axios'

export class ApiService {
  public appointments: AppointmentService
  public pets: PetService
  public owners: OwnerService
  public medicalRecords: MedicalRecordService
  public invoices: InvoiceService
  public products: ProductService
  public dashboard: DashboardService
  public auth: AuthService
  public reports: ReportService
  public settings: SettingsService
  public payments: PaymentService

  constructor(api: AxiosInstance) {
    this.appointments = new AppointmentService(api)
    this.pets = new PetService(api)
    this.owners = new OwnerService(api)
    this.medicalRecords = new MedicalRecordService(api)
    this.invoices = new InvoiceService(api)
    this.products = new ProductService(api)
    this.dashboard = new DashboardService(api)
    this.auth = new AuthService(api)
    this.reports = new ReportService(api)
    this.settings = new SettingsService(api)
    this.payments = new PaymentService(api)
  }
}

export * from './appointmentService'
export * from './petService'
export * from './ownerService'
export * from './medicalRecordService'
export * from './invoiceService'
export * from './productService'
export * from './dashboardService'
export * from './authService'
export * from './reportService'
export * from './settingsService'
export * from './paymentService'
