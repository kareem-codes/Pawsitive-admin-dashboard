export interface Permission {
  id: number
  name: string
  guard_name: string
}

export interface Role {
  id: number
  name: string
  guard_name: string
  permissions?: Permission[]
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  phone?: string
  avatar?: string
  roles?: Role[]
  permissions?: Permission[]
  created_at?: string
  updated_at?: string
}

export interface Pet {
  id: number
  name: string
  species: string
  breed: string
  age?: number
  weight?: number
  color?: string
  gender: 'male' | 'female'
  owner_id: number
  owner?: Owner
  medical_history?: string
  allergies?: string
  microchip_id?: string
  image_url?: string
  status: 'active' | 'inactive' | 'deceased'
  created_at: string
  updated_at: string
}

export interface Owner {
  id: number
  name: string
  email: string
  phone: string
  address?: string
  city?: string
  postal_code?: string
  emergency_contact?: string
  emergency_phone?: string
  pets?: Pet[]
  notes?: string
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: number
  pet_id: number
  pet?: Pet
  owner_id: number
  owner?: Owner
  veterinarian_id?: number
  veterinarian?: User
  appointment_date: string
  appointment_time?: string
  duration_minutes?: number
  type?: string
  reason: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  diagnosis?: string
  treatment?: string
  created_at: string
  updated_at: string
}

export interface MedicalRecord {
  id: number
  pet_id: number
  pet?: Pet
  appointment_id?: number
  appointment?: Appointment
  veterinarian_id: number
  veterinarian?: User
  visit_date: string
  weight?: number
  temperature?: number
  diagnosis?: string
  treatment?: string
  prescriptions?: string
  procedures?: string
  notes?: string
  next_visit_date?: string
  symptoms?: string
  follow_up_date?: string
  attachments?: string[]
  vaccinations?: Vaccination[]
  created_at: string
  updated_at: string
}

export interface Vaccination {
  id: number
  pet_id: number
  pet?: Pet
  medical_record_id?: number
  vaccine_name: string
  administered_date: string
  next_due_date?: string
  batch_number?: string
  veterinarian_id?: number
  veterinarian?: User
  notes?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  description?: string
  category: string
  sku: string
  barcode?: string
  price: number
  cost?: number
  cost_price?: number
  stock_quantity: number
  quantity_in_stock?: number
  min_stock_level: number
  reorder_threshold?: number
  unit?: string
  supplier?: string
  expiry_date?: string
  tax_percentage?: number
  tax_fixed?: number
  image_url?: string
  image?: string
  is_active?: boolean
  status: 'active' | 'inactive' | 'discontinued'
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: number
  invoice_number: string
  user_id?: number
  owner_id?: number
  owner?: Owner
  pet_id?: number
  pet?: Pet
  appointment_id?: number
  appointment?: Appointment
  created_by?: number
  issue_date?: string // Legacy field name
  invoice_date?: string // Backend field name
  due_date?: string
  status: 'draft' | 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled'
  subtotal?: number
  tax?: number
  tax_amount?: number
  discount?: number
  discount_amount?: number
  total?: number
  total_amount?: number
  paid_amount?: number
  payment_method?: string
  payment_date?: string
  notes?: string
  items?: InvoiceItem[]
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  id: number
  invoice_id: number
  product_id?: number
  product?: Product
  description: string
  quantity: number
  unit_price: number
  total: number
}

export interface DashboardStats {
  todayAppointments: number
  activePets: number
  pendingBills: number
  lowStockItems: number
  totalRevenue?: number
  monthlyRevenue?: number
}

export interface Activity {
  id: number
  type: string
  description: string
  icon: string
  timestamp: string
  user?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  per_page: number
  current_page: number
  last_page: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
