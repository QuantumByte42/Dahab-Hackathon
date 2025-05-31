export interface Sale {
  id: string
  customer_name: string
  customer_id?: string
  gold_type: string
  karat: number
  weight_grams: number
  price_per_gram_jod: number
  total_price_jod: number
  payment_method: "cash" | "card" | "deferred"
  created: string
  updated: string
}

export interface InventoryItem {
  id: string
  name: string
  type: string
  karat: number
  weight_grams: number
  cost_price_jod: number
  selling_price_jod: number
  quantity: number
  created: string
  updated: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  total_purchases_jod: number
  created: string
  updated: string
}

export interface Settings {
  id: string
  gold_prices: Record<string, number> // karat -> price per gram
  tax_rate: number
  language: "en" | "ar"
  currency_symbol: string
  created: string
  updated: string
}

export interface Transaction {
  id: string
  sale_id: string
  customer_name: string
  gold_type: string
  total_amount_jod: number
  payment_method: string
  created: string
}
