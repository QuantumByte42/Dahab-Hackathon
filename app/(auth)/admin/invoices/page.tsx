"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { History, Search, Filter, Download, Calendar } from "lucide-react"
import { InvoicesRecord } from '@/lib/pocketbase-types'
import { get_invoices } from '@/lib/api'

export default function InvoicesPage() {
  const { t, isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("")
  const [invoices, setInvoices] = useState<InvoicesRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const data = await get_invoices()
        setInvoices(data)
      } catch (error) {
        console.error('Error fetching invoices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.expand?.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPayment = !paymentFilter || paymentFilter === "all" || invoice.type === paymentFilter

    // Simple date filter - in real app, you'd want more sophisticated date filtering
    const matchesDate = !dateFilter || new Date(invoice.created || "").toDateString().includes(dateFilter)

    return matchesSearch && matchesPayment && matchesDate
  })

  const totalAmount = filteredInvoices.reduce((sum: number, invoice: InvoicesRecord) => sum + (invoice.total_amount || 0), 0)

  const exportTransactions = () => {
    // Here you would implement CSV/PDF export
    console.log("Exporting transactions:", filteredInvoices)
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
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading invoices...</div>
        </div>
      ) : (
        <>          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-6 w-6" />
              <h1 className="text-3xl font-bold">{t("invoices")}</h1>
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
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredInvoices.length}</div>
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
                <CardTitle className="text-sm font-medium">Average Invoice Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredInvoices.length > 0 ? (totalAmount / filteredInvoices.length).toFixed(2) : '0.00'} {isRTL ? "د.أ" : "JOD"}
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
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
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
              <Label>&nbsp;</Label>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setDateFilter("")
                  setPaymentFilter("")
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>          {/* Invoices Table */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice History ({filteredInvoices.length})</CardTitle>
            </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice: InvoicesRecord) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                  <TableCell className="font-medium">{invoice.expand?.customer?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getPaymentMethodBadge(invoice.type || 'cash')}>
                      {t(invoice.type || 'cash')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">
                        {new Date(invoice.created || "").toLocaleDateString(isRTL ? "ar-JO" : "en-US")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(invoice.created || "").toLocaleTimeString(isRTL ? "ar-JO" : "en-US")}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
        </>
      )}
    </div>
  )
}
