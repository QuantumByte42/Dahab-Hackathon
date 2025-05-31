export interface InventoryItem {
  id: string // Item ID
  name: string // Item Name
  type: "Ring" | "Bracelet" | "Necklace" | "Earrings" | "Pendant" | "Chain" | "Bangle" // Item Type
  weight_grams: number // Item Weight
  karat: 24 | 21 | 18 | 14 // Karat
  wholesale_vendor: {
    name: string
    contact: string
    address?: string
    phone?: string
  } // Wholesale Vendor Information
  cost_price_jod: number
  selling_price_jod: number
  quantity: number
  created: string
  updated: string
}

export interface SaleItem {
  item_id: string
  item_name: string
  item_type: string
  weight_grams: number
  karat: number
  selling_price: number
  making_charges: number // Auto-calculated from selling price
  quantity: number
}

export interface SaleTransaction {
  id: string
  invoice_number: string
  customer_name: string
  customer_phone?: string
  items: SaleItem[] // Multiple items in single invoice
  subtotal: number
  total_making_charges: number
  total_amount: number
  transaction_type: "Cash" | "Credit"
  date_time: string // Default: Now
  employee_id: string
  created: string
  updated: string
}

export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  role: "Admin" | "Cashier" | "Manager"
  merchant_id: string
  is_active: boolean
  created: string
  last_login?: string
}

export interface PerformanceMetrics {
  employee_id: string
  employee_name: string
  total_sales: number
  total_transactions: number
  total_amount_sold: number
  average_transaction_value: number
  period_start: string
  period_end: string
}
