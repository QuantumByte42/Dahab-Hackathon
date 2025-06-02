"use client"

import { useState, useEffect } from 'react'
import { getPocketBase } from '@/lib/pocketbase'
import { TypedPocketBase } from '@/pocketbase-types'

interface DashboardStats {
  dailySales: number
  totalGoldWeight: number
  transactionsCount: number
  recentTransactions: RecentTransaction[]
  lowStockItems: LowStockItem[]
  totalInventoryValue: number
  topSellingItems: TopSellingItem[]
  activeEmployees: number
  monthlyRevenue: number
  averageOrderValue: number
}

interface RecentTransaction {
  id: string
  customer_name: string
  gold_type: string
  total_amount_jod: number
  created: string
}

interface LowStockItem {
  id: string
  item_name: string
  item_type: string
  quantity: number
  karat: string
}

interface TopSellingItem {
  item_type: string
  total_sold: number
  revenue: number
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardStats>({
    dailySales: 0,
    totalGoldWeight: 0,
    transactionsCount: 0,
    recentTransactions: [],
    lowStockItems: [],
    totalInventoryValue: 0,
    topSellingItems: [],
    activeEmployees: 0,
    monthlyRevenue: 0,
    averageOrderValue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError(null)
        
        const pb = getPocketBase() as TypedPocketBase
        
        // Get today's date range
        const today = new Date()
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
        
        const startISO = startOfDay.toISOString()
        const endISO = endOfDay.toISOString()

        // Fetch today's invoices for daily sales and transaction count
        const todayInvoices = await pb.collection('invoices').getList(1, 50, {
          filter: `created >= "${startISO}" && created < "${endISO}"`,
          sort: '-created'
        })

        // Calculate daily sales
        const dailySales = todayInvoices.items.reduce((total, invoice) => {
          return total + (invoice.total_amount || 0)
        }, 0)

        // Get recent transactions (last 5)
        const recentInvoices = await pb.collection('invoices').getList(1, 5, {
          sort: '-created'
        })

        // Transform recent invoices to match the expected format
        const recentTransactions: RecentTransaction[] = recentInvoices.items.map(invoice => {
          // Extract item types from the items JSON
          let goldType = 'Gold Item'
          if (invoice.items && typeof invoice.items === 'object') {
            const items = Array.isArray(invoice.items) ? invoice.items : [invoice.items]
            if (items.length > 0 && items[0]?.item_type) {
              goldType = items[0].item_type
            }
          }

          return {
            id: invoice.id,
            customer_name: invoice.customer_name || 'Unknown Customer',
            gold_type: goldType,
            total_amount_jod: invoice.total_amount || 0,
            created: invoice.created
          }
        })

        // Fetch inventory to calculate total gold weight and low stock items
        const inventory = await pb.collection('inventory').getList(1, 200, {
          fields: 'id,item_name,item_type,weight,quantity,karat,cost_price,selling_price'
        })

        // Calculate total gold weight (weight * quantity for each item)
        const totalGoldWeight = inventory.items.reduce((total, item) => {
          const weight = item.weight || 0
          const quantity = item.quantity || 1
          return total + (weight * quantity)
        }, 0)

        // Find low stock items (quantity <= 5)
        const lowStockItems: LowStockItem[] = inventory.items
          .filter(item => (item.quantity || 0) <= 5)
          .map(item => ({
            id: item.id,
            item_name: item.item_name,
            item_type: item.item_type,
            quantity: item.quantity || 0,
            karat: item.karat
          }))

        // Calculate total inventory value
        const totalInventoryValue = inventory.items.reduce((total, item) => {
          const cost = item.cost_price || 0
          const quantity = item.quantity || 1
          return total + (cost * quantity)
        }, 0)

        // Get monthly revenue (current month)
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const monthlyInvoices = await pb.collection('invoices').getList(1, 100, {
          filter: `created >= "${firstDayOfMonth.toISOString()}"`,
          sort: '-created'
        })

        const monthlyRevenue = monthlyInvoices.items.reduce((total, invoice) => {
          return total + (invoice.total_amount || 0)
        }, 0)

        // Calculate average order value
        const totalInvoices = await pb.collection('invoices').getList(1, 50, {
          sort: '-created'
        })
        const totalRevenue = totalInvoices.items.reduce((total, invoice) => {
          return total + (invoice.total_amount || 0)
        }, 0)
        const averageOrderValue = totalInvoices.items.length > 0 ? totalRevenue / totalInvoices.items.length : 0

        // Get active employees count
        const activeEmployees = await pb.collection('admins').getList(1, 50, {
          filter: 'is_active = true',
          fields: 'id'
        })

        // Calculate top selling items from recent invoices
        const itemTypeCounts: { [key: string]: { count: number; revenue: number } } = {}
        
        recentInvoices.items.forEach(invoice => {
          if (invoice.items && typeof invoice.items === 'object') {
            const items = Array.isArray(invoice.items) ? invoice.items : [invoice.items]
            items.forEach((item: unknown) => {
              if (item && typeof item === 'object' && 'item_type' in item) {
                const itemObj = item as { item_type?: string; quantity?: number; selling_price?: number }
                if (itemObj?.item_type) {
                  const type = itemObj.item_type
                  if (!itemTypeCounts[type]) {
                    itemTypeCounts[type] = { count: 0, revenue: 0 }
                  }
                  itemTypeCounts[type].count += itemObj.quantity || 1
                  itemTypeCounts[type].revenue += (itemObj.selling_price || 0) * (itemObj.quantity || 1)
                }
              }
            })
          }
        })

        const topSellingItems: TopSellingItem[] = Object.entries(itemTypeCounts)
          .map(([type, data]) => ({
            item_type: type,
            total_sold: data.count,
            revenue: data.revenue
          }))
          .sort((a, b) => b.total_sold - a.total_sold)
          .slice(0, 5)

        setData({
          dailySales,
          totalGoldWeight,
          transactionsCount: todayInvoices.items.length,
          recentTransactions,
          lowStockItems,
          totalInventoryValue,
          topSellingItems,
          activeEmployees: activeEmployees.items.length,
          monthlyRevenue,
          averageOrderValue
        })

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [refreshTrigger])

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return { data, loading, error, refetch }
}
