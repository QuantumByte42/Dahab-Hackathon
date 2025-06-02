"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { Coins, TrendingUp, Weight, Loader2, AlertCircle, Package, Users, AlertTriangle, DollarSign, ShoppingBag, Calendar, RefreshCw } from "lucide-react"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { t, isRTL } = useLanguage()
  const { data, loading, error, refetch } = useDashboardData()

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            <span className="text-lg text-amber-700">Loading dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8 p-6 flex flex-1 flex-col min-h-screen bg-gradient-to-br from-amber-25 via-white to-yellow-25">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-red-700">Error Loading Dashboard</h3>
              <p className="text-red-600">{error}</p>
              <Button 
                onClick={() => refetch()} 
                className="mt-4 bg-amber-600 hover:bg-amber-700"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
          {t("dashboard")}
        </h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 text-sm px-4 py-2">
            {new Date().toLocaleDateString(isRTL ? "ar-JO" : "en-US")}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">{t("dailySales")}</CardTitle>
            <TrendingUp className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">
              {data.dailySales.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
            </div>
            <p className="text-xs text-amber-600 font-medium">Today&apos;s sales</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">{t("totalGoldSold")}</CardTitle>
            <Weight className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">
              {data.totalGoldWeight.toFixed(1)} {isRTL ? "جرام" : "grams"}
            </div>
            <p className="text-xs text-amber-600 font-medium">Total inventory weight</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Transactions Today</CardTitle>
            <Coins className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">{data.transactionsCount}</div>
            <p className="text-xs text-amber-600 font-medium">Today&apos;s transactions</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Monthly Revenue</CardTitle>
            <Calendar className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">
              {data.monthlyRevenue.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
            </div>
            <p className="text-xs text-amber-600 font-medium">This month&apos;s revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 hover:shadow-lg transition-all duration-300 hover:shadow-blue-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Inventory Value</CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {data.totalInventoryValue.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
            </div>
            <p className="text-xs text-blue-600 font-medium">Total inventory value</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-300 hover:shadow-green-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Active Employees</CardTitle>
            <Users className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{data.activeEmployees}</div>
            <p className="text-xs text-green-600 font-medium">Currently active</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-lg transition-all duration-300 hover:shadow-purple-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Avg. Order Value</CardTitle>
            <DollarSign className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {data.averageOrderValue.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
            </div>
            <p className="text-xs text-purple-600 font-medium">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert & Top Selling Items */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Low Stock Alert */}
        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
          <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {data.lowStockItems.length === 0 ? (
                <div className="text-center py-8 text-green-600">
                  <p>All items are well stocked!</p>
                </div>
              ) : (
                data.lowStockItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-4 border border-red-100 rounded-lg bg-gradient-to-r from-red-25 to-pink-25 hover:shadow-md transition-all duration-300"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-red-900">{item.item_name}</p>
                      <p className="text-sm text-red-700">{item.item_type} - {item.karat}K</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-red-900">{item.quantity}</p>
                      <p className="text-sm text-red-600">remaining</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Top Selling Items
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {data.topSellingItems.length === 0 ? (
                <div className="text-center py-8 text-green-600">
                  <p>No sales data available</p>
                </div>
              ) : (
                data.topSellingItems.map((item, index) => (
                  <div 
                    key={item.item_type} 
                    className="flex items-center justify-between p-4 border border-green-100 rounded-lg bg-gradient-to-r from-green-25 to-emerald-25 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-green-900">{item.item_type}</p>
                        <p className="text-sm text-green-700">{item.total_sold} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-900">
                        {item.revenue.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                      </p>
                      <p className="text-sm text-green-600">revenue</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-amber-200 bg-gradient-to-br from-white to-amber-50">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold">{t("recentTransactions")}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {data.recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-amber-600">
                <p>No recent transactions found</p>
              </div>
            ) : (
              data.recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 border border-amber-100 rounded-lg bg-gradient-to-r from-amber-25 to-yellow-25 hover:shadow-md transition-all duration-300 hover:border-amber-300"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                      <p className="font-semibold text-amber-900">{transaction.customer_name}</p>
                    </div>
                    <p className="text-sm text-amber-700 ml-4">{transaction.gold_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-amber-900">
                      {transaction.total_amount_jod.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                    </p>
                    <p className="text-sm text-amber-600">
                      {new Date(transaction.created).toLocaleTimeString(isRTL ? "ar-JO" : "en-US")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
