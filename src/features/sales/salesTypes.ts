export interface Sale {
  id?: string
  userId: string
  customerId: string
  items: Array<{
    itemId: string
    quantity: number
    price: number
  }>
  total: number
  date: string
  status: 'pending' | 'completed' | 'cancelled'
  notes?: string
}

export interface SaleWithDetails extends Sale {
  customerName?: string
  itemNames?: string[]
}
