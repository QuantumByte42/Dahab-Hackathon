"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Calendar, TrendingUp, Package, Users } from "lucide-react"

export default function ReportsPage() {
  const [reportType, setReportType] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [employeeFilter, setEmployeeFilter] = useState("")

  const reportTypes = [
    { value: "sales", label: "Sales Report", icon: TrendingUp },
    { value: "inventory", label: "Inventory Report", icon: Package },
    { value: "employee", label: "Employee Performance", icon: Users },
    { value: "customer", label: "Customer Analysis", icon: Users },
    { value: "financial", label: "Financial Summary", icon: FileText },
  ]

  const generateReport = () => {
    const reportData = {
      type: reportType,
      dateFrom,
      dateTo,
      employeeFilter,
      generatedAt: new Date().toISOString(),
    }

    console.log("Generating report:", reportData)
    // Here you would generate the actual report and export to Excel
  }

  const exportToExcel = () => {
    // Here you would implement Excel export functionality
    console.log("Exporting to Excel...")
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-amber-25 via-white to-yellow-25 min-h-screen">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
          Reports & Analytics
        </h1>
      </div>

      {/* Report Generation */}
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold">Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="report_type" className="text-amber-700 font-medium">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="border-amber-200 focus:ring-amber-400 focus:border-amber-400 bg-white/70">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_from" className="text-amber-700 font-medium">From Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                <Input
                  id="date_from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="pl-10 border-amber-200 focus:ring-amber-400 focus:border-amber-400 bg-white/70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_to" className="text-amber-700 font-medium">To Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                <Input
                  id="date_to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="pl-10 border-amber-200 focus:ring-amber-400 focus:border-amber-400 bg-white/70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee_filter" className="text-amber-700 font-medium">Employee (Optional)</Label>
              <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                <SelectTrigger className="border-amber-200 focus:ring-amber-400 focus:border-amber-400 bg-white/70">
                  <SelectValue placeholder="All employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  <SelectItem value="EMP001">أحمد محمد الخالدي</SelectItem>
                  <SelectItem value="EMP002">فاطمة علي السعدي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={generateReport} 
              className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200" 
              disabled={!reportType || !dateFrom || !dateTo}
            >
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
            <Button 
              onClick={exportToExcel} 
              variant="outline" 
              className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400" 
              disabled={!reportType}
            >
              <Download className="h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Today&apos;s Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">24</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">15,420 JOD</div>
            <p className="text-xs text-muted-foreground">+8% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Active Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">156</div>
            <p className="text-xs text-muted-foreground">12 low stock</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Active Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">8</div>
            <p className="text-xs text-muted-foreground">2 online now</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="border-amber-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100 rounded-t-lg">
          <CardTitle className="text-amber-800 font-semibold">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Sales Report - January 2024", type: "Sales", date: "2024-01-15", size: "2.3 MB" },
              { name: "Inventory Analysis - Q4 2023", type: "Inventory", date: "2024-01-10", size: "1.8 MB" },
              { name: "Employee Performance - December", type: "Employee", date: "2024-01-05", size: "945 KB" },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-amber-100 rounded-lg bg-gradient-to-r from-amber-25 to-yellow-25 hover:from-amber-50 hover:to-yellow-50 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-900">{report.name}</p>
                    <p className="text-sm text-amber-700">
                      {report.type} • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-amber-600">{report.date}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
