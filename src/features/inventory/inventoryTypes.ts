export interface InventoryItem {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  category: string
  sku: string
  lastUpdated: Date
  minStockLevel: number
}
