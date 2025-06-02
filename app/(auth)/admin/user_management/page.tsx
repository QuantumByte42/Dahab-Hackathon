"use client"

import { useEffect, useState } from "react"
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
import { AdminsRecord } from "@/lib/pocketbase-types"
import { get_admins } from "@/lib/api"
import { getPocketBase } from "@/lib/pocketbase"
import { submitForm } from "@/lib/submit"

export default function UserManagementPage() {
  const { isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [employees, setEmployees] = useState<AdminsRecord[]>([])
  //   const [performance] = useState(mockPerformance)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  })

  const roles = ["admin", "manager", "sales"]

  useEffect(() => {
    const fetch = async () => {
      try {
        let filter = ""
        if (searchTerm !== "")
          filter = `name ~ '${searchTerm}' || email ~ '${searchTerm}' || role ~ '${searchTerm}'`

        const employees = await get_admins(filter)
        setEmployees(employees)
      } catch {
        setEmployees([])
      }
    }
    fetch()
  }, [])

  const toggleEmployeeStatus = async (employeeId: string, current_status: boolean) => {
    // Here you would update employee status in PocketBase
    const pb = getPocketBase()

    try {
      await pb.collection("admins").update(employeeId, {
        is_active: !current_status
      })
      console.log("Toggling status for employee:", employeeId)
    } catch { }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      const data = {...newEmployee, passwordConfirm: newEmployee.password}
      await submitForm(null, "admins", data)
    } catch {

    }
    setShowAddDialog(false)
    setNewEmployee({ name: "", email: "", phone: "", role: "", password: "" })
  }

  const handleCancelButton = () => {
    setShowAddDialog(false)
    setNewEmployee({ name: "", email: "", phone: "", role: "", password: "" })
  }

  return (
    <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-amber-25 via-white to-yellow-25">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-amber-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">User Management</h1>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="border-amber-200">
            <DialogHeader>
              <DialogTitle className="text-amber-800">Add New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="employee@goldstore.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
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
                  <Label htmlFor="password">Initial Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    placeholder="Enter initial password"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancelButton}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0"
                  >
                    Add Employee
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tab Navigation */}
      {/* <div className="flex space-x-1 bg-gradient-to-r from-amber-100 to-yellow-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "employees" ? "default" : "ghost"}
          className={activeTab === "employees" ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white" : "text-amber-700 hover:bg-amber-200"}
          size="sm"
          onClick={() => setActiveTab("employees")}
        >
          Employees
        </Button>
        <Button
          variant={activeTab === "performance" ? "default" : "ghost"}
          className={activeTab === "performance" ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white" : "text-amber-700 hover:bg-amber-200"}
          size="sm"
          onClick={() => setActiveTab("performance")}
        >
          Performance
        </Button>
      </div> */}

      {/* {activeTab === "employees" && (
        <> */}
      {/* Search */}
      <Card className="border-amber-200 bg-gradient-to-br from-white to-amber-50">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-amber-200 focus:border-amber-400 focus:ring-amber-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card className="border-amber-200 bg-gradient-to-br from-white to-amber-50">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold">Employees ({employees.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
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
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>
                    <Badge variant={employee.role === "admin" ? "default" : "secondary"}>{employee.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={employee.is_active ? "default" : "destructive"}>
                      {employee.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {employee.last_login
                      ? (
                        <div>
                          <div>
                            {new Date(employee.last_login).toLocaleDateString(isRTL ? "ar-JO" : "en-US")}
                          </div>
                          <div className="mt-1">
                            {new Date(employee.last_login).toLocaleTimeString(isRTL ? "ar-JO" : "en-US")}
                          </div>
                        </div>
                      ) : "Never"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toggleEmployeeStatus(employee.id, employee.is_active || false)}>
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
      {/* </>
      )}

      {activeTab === "performance" && (
        <Card className="border-amber-200 bg-gradient-to-br from-white to-amber-50">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold">Employee Performance (Last 15 Days)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
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
                      <Badge 
                        className={perf.total_amount_sold > 12000 ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white" : "bg-amber-100 text-amber-800"}
                      >
                        {perf.total_amount_sold > 12000 ? "Excellent" : "Good"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )} */}
    </div>
  )
}
