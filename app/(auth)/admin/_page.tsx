"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { Coins, TrendingUp, Weight } from "lucide-react"
import { getPocketBase } from "@/lib/pocketbase"
import { InvoicesRecord } from "@/lib/pocketbase-types"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { t, isRTL } = useLanguage()
  const [data, setData] = useState<{
    dailySales: number,
    totalGoldWeight: number,
    totalTransactionsToday: number,
    recentTransactions: InvoicesRecord[]
  }>
  ({
    dailySales: 0,
    totalGoldWeight: 0,
    totalTransactionsToday: 0,
    recentTransactions: []
  })

  useEffect(() => {
    async function fetch() {
      try {
        const pb = getPocketBase()

        const today = new Date();
        
        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        const filter = `created >= "${formatDate(today)} 00:00:00" && created < "${formatDate(today)} 23:59:59"`;
        console.log(`filter: ${filter}`)
        const invoices = await pb.collection("invoices").getFullList<InvoicesRecord>({
          filter: filter
        })
        console.log(invoices, invoices.length)
        if (invoices.length === 0)
        {
          const records = await pb.collection("invoices").getList<InvoicesRecord>(1, 3, {
            sort: "-created"
          })
          if (records.totalItems === 0)
            return null
          setData ({
            dailySales: 0,
            totalGoldWeight: 0,
            totalTransactionsToday: 0,
            recentTransactions: invoices.slice(0, 3)
          })
        }

        let dailySales = 0
        let totalGoldWeight = 0
        for (let i = 0; i < invoices.length; i++) {
          const invoice = invoices[i];
          dailySales += invoice.total_amount || 0
          if (invoice.items) {
            for (let j = 0; j < invoice.items.length; j++) {
              const item = invoice.items[j];
              totalGoldWeight += item.weight * item.quantity
            }
          }
        }
        setData ({
          dailySales: dailySales,
          totalGoldWeight: totalGoldWeight,
          totalTransactionsToday: invoices.length,
          recentTransactions: invoices.slice(0, 3)
        })
      } catch {}
    
    }

    fetch()
  }, [])

  return (
    <div className="space-y-8 flex flex-1 flex-col min-h-screen bg-gradient-to-br from-amber-25 via-white to-yellow-25 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
          {t("dashboard")}
        </h1>
        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 text-sm px-4 py-2">
          {new Date().toLocaleDateString(isRTL ? "ar-JO" : "en-US")}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">{t("dailySales")}</CardTitle>
            <TrendingUp className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">
              {data.dailySales.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
            </div>
            {/* <p className="text-xs text-amber-600 font-medium">+12.5% from yesterday</p> */}
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">{t("totalGoldSold")}</CardTitle>
            <Weight className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">
              {data.totalGoldWeight} {isRTL ? "جرام" : "grams"}
            </div>
            {/* <p className="text-xs text-amber-600 font-medium">+8.2% from yesterday</p> */}
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Transactions Today</CardTitle>
            <Coins className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">{data.totalTransactionsToday}</div>
            {/* <p className="text-xs text-amber-600 font-medium">+3 from yesterday</p> */}
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
            {data.recentTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-4 border border-amber-100 rounded-lg bg-gradient-to-r from-amber-25 to-yellow-25 hover:shadow-md transition-all duration-300 hover:border-amber-300"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                    <p className="font-semibold text-amber-900">{transaction.customer_name}</p>
                  </div>
                  <p className="text-sm text-amber-700 ml-4">{transaction.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-amber-900">
                    {transaction.total_amount?.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                  </p>
                  <p className="text-sm text-amber-600">
                    {new Date(transaction.created || "").toLocaleTimeString(isRTL ? "ar-JO" : "en-US")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
