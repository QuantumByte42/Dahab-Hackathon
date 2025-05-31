"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { History, Search, Filter, Download, Calendar } from "lucide-react"

// Mock transaction data
const mockTransactions = [
  {
    id: "txn_001",
    sale_id: "sale_001",
    customer_name: "أحمد محمد الخالدي",
    gold_type: "خاتم ذهب",
    karat: 21,
    weight_grams: 5.2,
    price_per_gram_jod: 41.25,
    total_amount_jod: 214.5,
    payment_method: "cash",
    created: "2024-01-15T10:30:00Z",
  },
  {
    id: "txn_002",
    sale_id: "sale_002",
    customer_name: "فاطمة علي السعدي",
    gold_type: "سلسلة ذهب",
    karat: 18,
    weight_grams: 8.5,
    price_per_gram_jod: 35.5,
    total_amount_jod: 301.75,
    payment_method: "card",
    created: "2024-01-15T09:15:00Z",
  },
  {
    id: "txn_003",
    sale_id: "sale_003",
    customer_name: "محمد خالد النعيمي",
    gold_type: "أقراط ذهب",
    karat: 22,
    weight_grams: 3.8,
    price_per_gram_jod: 43.8,
    total_amount_jod: 166.44,
    payment_method: "deferred",
    created: "2024-01-14T16:45:00Z",
  },
  {
    id: "txn_004",
    sale_id: "sale_004",
    customer_name: "سارة أحمد الزهراني",
    gold_type: "سوار ذهب",
    karat: 21,
    weight_grams: 12.3,
    price_per_gram_jod: 41.25,
    total_amount_jod: 507.38,
    payment_method: "cash",
    created: "2024-01-14T14:20:00Z",
  },
  {
    id: "txn_005",
    sale_id: "sale_005",
    customer_name: "عبدالله محمد الحسني",
    gold_type: "دلاية ذهب",
    karat: 24,
    weight_grams: 2.1,
    price_per_gram_jod: 47.2,
    total_amount_jod: 99.12,
    payment_method: "card",
    created: "2024-01-13T11:10:00Z",
  },
]

export function Transactions() {
  const { t, isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("")
  const [goldTypeFilter, setGoldTypeFilter] = useState("")
  const [transactions] = useState(mockTransactions)

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.gold_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPayment = !paymentFilter || transaction.payment_method === paymentFilter
    const matchesGoldType = !goldTypeFilter || transaction.gold_type.includes(goldTypeFilter)

    // Simple date filter - in real app, you'd want more sophisticated date filtering
    const matchesDate = !dateFilter || transaction.created.includes(dateFilter)

    return matchesSearch && matchesPayment && matchesGoldType && matchesDate
  })

  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.total_amount_jod, 0)
  const totalWeight = filteredTransactions.reduce((sum, transaction) => sum + transaction.weight_grams, 0)

  const exportTransactions = () => {
    // Here you would implement CSV/PDF export
    console.log("Exporting transactions:", filteredTransactions)
  }

  const getPaymentMethodBadge = (method: string) => {
    const variants = {
      cash: "default" as const,
      card: "secondary" as const,
      deferred: "destructive" as const,
    }
    return variants[method as keyof typeof variants] || "default"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-6 w-6" />
          <h1 className="text-3xl font-bold">{t("transactions")}</h1>
        </div>
        <Button onClick={exportTransactions} className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAmount.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Gold Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalWeight.toFixed(1)} {isRTL ? "جرام" : "grams"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All methods</SelectItem>
                  <SelectItem value="cash">{t("cash")}</SelectItem>
                  <SelectItem value="card">{t("card")}</SelectItem>
                  <SelectItem value="deferred">{t("deferred")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gold Type</Label>
              <Select value={goldTypeFilter} onValueChange={setGoldTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="خاتم">خاتم (Ring)</SelectItem>
                  <SelectItem value="سلسلة">سلسلة (Necklace)</SelectItem>
                  <SelectItem value="أقراط">أقراط (Earrings)</SelectItem>
                  <SelectItem value="سوار">سوار (Bracelet)</SelectItem>
                  <SelectItem value="دلاية">دلاية (Pendant)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setDateFilter("")
                  setPaymentFilter("")
                  setGoldTypeFilter("")
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Gold Item</TableHead>
                <TableHead>Karat</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Price/Gram</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                  <TableCell className="font-medium">{transaction.customer_name}</TableCell>
                  <TableCell>{transaction.gold_type}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.karat}K</Badge>
                  </TableCell>
                  <TableCell>{transaction.weight_grams}g</TableCell>
                  <TableCell>
                    {transaction.price_per_gram_jod.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.total_amount_jod.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPaymentMethodBadge(transaction.payment_method)}>
                      {t(transaction.payment_method)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">
                        {new Date(transaction.created).toLocaleDateString(isRTL ? "ar-JO" : "en-US")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.created).toLocaleTimeString(isRTL ? "ar-JO" : "en-US")}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
