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
import * as XLSX from 'xlsx';

export default function InvoicesPage() {
  const { t, isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("")
  const [invoices, setInvoices] = useState<InvoicesRecord[]>([])
  const [loading, setLoading] = useState(false)
  // const [filter, setFilter] = useState("")

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // setLoading(true)
        let filter = ""
        if (searchTerm !== "")
          filter += (filter === ""? "" : " && ") 
            + `(customer_name ~ '${searchTerm}' || No ~ '${searchTerm}') `
        if (dateFilter !== "")
          filter += (filter === ""? "" : " && ") 
            + `(created >= '${dateFilter} 00:00:00' && created <= '${dateFilter} 23:59:59')`
        if (paymentFilter !== "")
          filter += (filter === ""? "" : " && ") 
            + `type = '${paymentFilter}'`
        const data = await get_invoices(filter) 
        setInvoices(data)
        // setFilter(filter)
      } catch (error) {
        console.error('Error fetching invoices:', error)
      } finally {
        // setLoading(false)
      }
    }

    fetchInvoices()
  }, [searchTerm, dateFilter, paymentFilter])


  const totalAmount = invoices.reduce((sum: number, invoice: InvoicesRecord) => sum + (invoice.total_amount || 0), 0)

  const exportTransactions = () => {

    // TODO: Here you would implement CSV/PDF export
    const data = invoices.map((invoice) => ({
      No: invoice.No,
      customer_name: invoice.customer_name,
      customer_phone: invoice.customer_phone,
      subtotal: invoice.subtotal,
      making_charges: invoice.making_charges,
      total_amount: invoice.total_amount,
      payment_method: invoice.type,
      date: invoice.created
    }))

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "invoices");

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Create a blob and trigger download manually
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoices.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
    <div className="space-y-8 p-6 bg-gradient-to-br from-amber-25 via-white to-yellow-25 min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-amber-700">Loading invoices...</div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg">
                <History className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                {t("invoices")}
              </h1>
            </div>
            <Button
              onClick={exportTransactions}
              className="gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{invoices.length}</div>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-800">Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-900">
                  {totalAmount.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                </div>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-800">Average Invoice Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-900">
                  {invoices.length > 0 ? (totalAmount / invoices.length).toFixed(2) : '0.00'} {isRTL ? "د.أ" : "JOD"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Filter className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* <p>{filter}</p> */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label className="text-amber-700 font-medium">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                    <Input
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-amber-200 focus:ring-amber-400 focus:border-amber-400 bg-white/70"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-amber-700 font-medium">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                    <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="pl-10 border-amber-200 focus:ring-amber-400 focus:border-amber-400 bg-white/70"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-amber-700 font-medium">Payment Method</Label>
                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="border-amber-200 focus:ring-amber-400 focus:border-amber-400 bg-white/70">
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
                    className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Invoices Table */}
          <Card className="border-amber-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100 rounded-t-lg">
              <CardTitle className="text-amber-800 font-semibold">Invoice History ({invoices.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                    <TableHead className="text-white font-semibold">Invoice ID</TableHead>
                    <TableHead className="text-white font-semibold">Customer</TableHead>
                    <TableHead className="text-white font-semibold">Payment Type</TableHead>
                    <TableHead className="text-white font-semibold">Subtotal</TableHead>
                    <TableHead className="text-white font-semibold">Making Charges</TableHead>
                    <TableHead className="text-white font-semibold">Total Amount</TableHead>
                    <TableHead className="text-white font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice: InvoicesRecord) => {
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono text-sm">{invoice.No}</TableCell>
                        <TableCell className="font-medium">{invoice.customer_name || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={getPaymentMethodBadge(invoice.type || 'cash')}>
                            {t(invoice.type || 'cash')}
                          </Badge>
                        </TableCell>
                        <TableCell>{invoice.subtotal}</TableCell>
                        <TableCell>{invoice.making_charges}</TableCell>
                        <TableCell>{invoice.total_amount}</TableCell>
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
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
