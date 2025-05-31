"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import { Users, Plus, Search, Edit, Eye, Phone, Mail } from "lucide-react"
import { get_customers } from "@/lib/api"
import { CustomerRecord } from "@/lib/definitions"
import { submitForm } from "@/lib/submit"

// Mock purchase history
const mockPurchaseHistory = {
  "1": [
    {
      id: "sale_1",
      date: "2024-01-15",
      gold_type: "خاتم ذهب",
      amount_jod: 850.0,
      payment_method: "cash",
    },
    {
      id: "sale_2",
      date: "2024-01-08",
      gold_type: "سلسلة ذهب",
      amount_jod: 1200.0,
      payment_method: "card",
    },
  ],
}

export default function CustomersPage() {
  const { t, isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [customers, setCustomers] = useState<CustomerRecord[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  })

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    const fetch = async () => {
      const customers = await get_customers()
      setCustomers(customers);
    }
    fetch()
  }, [])

  const handleSubmit = async () => {
    console.log("test")
    try {
      const ret = await submitForm(null, "customers", newCustomer);
      if (ret.record)
        console.log(ret.msg)
      else
        console.error(ret.msg)
      // TODO add toast
    } catch {}
    setShowAddDialog(false)
    setNewCustomer({ name: "", phone: "", email: "", address: "" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCustomer((prev) => ({ ...prev, [name]: value }))
  }

  const handleCancelButton = () => {
    setShowAddDialog(false)
    setNewCustomer({ name: "", phone: "", email: "", address: "" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-3xl font-bold">{t("customers")}</h1>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4" >
                <div className="space-y-2">
                  <Label htmlFor="name">Customer Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newCustomer.name}
                    onChange={handleInputChange}
                    placeholder="Enter customer name"
                    required
                    />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newCustomer.phone}
                    onChange={handleInputChange}
                    placeholder="+962-XX-XXXXXXX"
                    required
                    />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={handleInputChange}
                    placeholder="customer@email.com"
                    />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address (Optional)</Label>
                  <Input
                    id="address"
                    name="address"
                    value={newCustomer.address}
                    onChange={handleInputChange}
                    placeholder="Customer address"
                    />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancelButton}>
                    {t("cancel")}
                  </Button>
                  <Button type="submit">{t("add")}</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`${t("search")} customers...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Purchases</TableHead>
                <TableHead>Purchase Count</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.address}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                      {customer.email && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {customer.total_purchases.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{customer.purchase_count} purchases</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(customer.last_purchase).toLocaleDateString(isRTL ? "ar-JO" : "en-US")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedCustomer(customer.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {(() => {
                const customer = customers.find((c) => c.id === selectedCustomer)
                if (!customer) return null

                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <p className="font-medium">{customer.name}</p>
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <p>{customer.phone}</p>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p>{customer.email}</p>
                      </div>
                      <div>
                        <Label>Address</Label>
                        <p>{customer.address}</p>
                      </div>
                    </div>

                    <div>
                      <Label>Purchase History</Label>
                      <div className="mt-2 space-y-2">
                        {(mockPurchaseHistory[selectedCustomer as keyof typeof mockPurchaseHistory] || []).map(
                          (purchase) => (
                            <div key={purchase.id} className="flex justify-between items-center p-3 border rounded">
                              <div>
                                <p className="font-medium">{purchase.gold_type}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(purchase.date).toLocaleDateString(isRTL ? "ar-JO" : "en-US")}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  {purchase.amount_jod.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                                </p>
                                <Badge variant="outline">{purchase.payment_method}</Badge>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
