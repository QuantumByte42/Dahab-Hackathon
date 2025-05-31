"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { Users, Plus, Search, Edit, UserCheck, UserX } from "lucide-react"

// Mock employee data
const mockEmployees = [
  {
    id: "EMP001",
    name: "أحمد محمد الخالدي",
    email: "ahmed.khaldi@goldstore.com",
    phone: "+962-79-1234567",
    role: "Manager",
    merchant_id: "MERCHANT001",
    is_active: true,
    created: "2024-01-01",
    last_login: "2024-01-15T10:30:00Z",
  },
  {
    id: "EMP002",
    name: "فاطمة علي السعدي",
    email: "fatima.saadi@goldstore.com",
    phone: "+962-77-9876543",
    role: "Cashier",
    merchant_id: "MERCHANT001",
    is_active: true,
    created: "2024-01-05",
    last_login: "2024-01-15T09:15:00Z",
  },
  {
    id: "EMP003",
    name: "محمد خالد النعيمي",
    email: "mohammed.naeemi@goldstore.com",
    phone: "+962-78-5555444",
    role: "Cashier",
    merchant_id: "MERCHANT001",
    is_active: false,
    created: "2023-12-15",
    last_login: "2024-01-10T16:45:00Z",
  },
]

// Mock performance data
const mockPerformance = [
  {
    employee_id: "EMP001",
    employee_name: "أحمد محمد الخالدي",
    total_sales: 45,
    total_transactions: 45,
    total_amount_sold: 15420.5,
    average_transaction_value: 342.68,
    period_start: "2024-01-01",
    period_end: "2024-01-15",
  },
  {
    employee_id: "EMP002",
    employee_name: "فاطمة علي السعدي",
    total_sales: 32,
    total_transactions: 32,
    total_amount_sold: 11250.75,
    average_transaction_value: 351.59,
    period_start: "2024-01-01",
    period_end: "2024-01-15",
  },
]

export function UserManagement() {
  const { t, isRTL } = useLanguage()
  const [activeTab, setActiveTab] = useState("employees")
  const [searchTerm, setSearchTerm] = useState("")
  const [employees] = useState(mockEmployees)
  const [performance] = useState(mockPerformance)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  })

  const roles = ["Admin", "Manager", "Cashier"]

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEmployee = () => {
    // Here you would add to PocketBase
    console.log("Adding employee:", newEmployee)
    setShowAddDialog(false)
    setNewEmployee({ name: "", email: "", phone: "", role: "", password: "" })
  }

  const toggleEmployeeStatus = (employeeId: string) => {
    // Here you would update employee status in PocketBase
    console.log("Toggling status for employee:", employeeId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emp_name">Full Name</Label>
                <Input
                  id="emp_name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp_email">Email</Label>
                <Input
                  id="emp_email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  placeholder="employee@goldstore.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp_phone">Phone</Label>
                <Input
                  id="emp_phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  placeholder="+962-XX-XXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp_role">Role</Label>
                <Select
                  value={newEmployee.role}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp_password">Initial Password</Label>
                <Input
                  id="emp_password"
                  type="password"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  placeholder="Enter initial password"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEmployee}>Add Employee</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "employees" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("employees")}
        >
          Employees
        </Button>
        <Button
          variant={activeTab === "performance" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("performance")}
        >
          Performance
        </Button>
      </div>

      {activeTab === "employees" && (
        <>
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Employees Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-mono text-sm">{employee.id}</TableCell>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.phone}</TableCell>
                      <TableCell>
                        <Badge variant={employee.role === "Admin" ? "default" : "secondary"}>{employee.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={employee.is_active ? "default" : "destructive"}>
                          {employee.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {employee.last_login
                          ? new Date(employee.last_login).toLocaleDateString(isRTL ? "ar-JO" : "en-US")
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => toggleEmployeeStatus(employee.id)}>
                            {employee.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
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

      {activeTab === "performance" && (
        <Card>
          <CardHeader>
            <CardTitle>Employee Performance (Last 15 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Amount Sold</TableHead>
                  <TableHead>Avg Transaction</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performance.map((perf) => (
                  <TableRow key={perf.employee_id}>
                    <TableCell className="font-medium">{perf.employee_name}</TableCell>
                    <TableCell>{perf.total_sales}</TableCell>
                    <TableCell>{perf.total_transactions}</TableCell>
                    <TableCell>
                      {perf.total_amount_sold.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                    </TableCell>
                    <TableCell>
                      {perf.average_transaction_value.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={perf.total_amount_sold > 12000 ? "default" : "secondary"}>
                        {perf.total_amount_sold > 12000 ? "Excellent" : "Good"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
