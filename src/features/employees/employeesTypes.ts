export interface Employee {
  id: string
  name: string
  email: string
  phone?: string
  isAdmin: boolean
  isSales: boolean
  position?: string
  hireDate: Date
  createdAt: Date
}
