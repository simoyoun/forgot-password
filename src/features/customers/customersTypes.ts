export interface Customer {
  id: string
  name: string
  email?: string
  phone: string
  address?: {
    street: string
    city: string
    state: string
    zip: string
  }
  notes?: string
  createdAt: Date
  lastPurchase?: Date
}
