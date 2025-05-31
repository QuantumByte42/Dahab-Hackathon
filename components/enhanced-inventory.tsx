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
import { Package, Plus, Search, Edit, Trash2, Building2 } from "lucide-react"

// Mock inventory data with enhanced fields
const mockInventory = [
  {
    id: "ITM001",
    name: "Classic Gold Ring",
    type: "Ring",
    weight_grams: 5.2,
    karat: 21,
    wholesale_vendor: {
      name: "Al-Zahra Gold Trading",
      contact: "Ahmad Al-Zahra",
      phone: "+962-6-5555555",
      address: "Downtown Amman, Jordan",
    },
    cost_price_jod: 180.0,
    selling_price_jod: 220.0,
    quantity: 12,
    created: "2024-01-01",
    updated: "2024-01-15",
  },
  {
    id: "ITM002",
    name: "Luxury Gold Chain",
    type: "Chain",
    weight_grams: 8.5,
    karat: 18,
    wholesale_vendor: {
      name: "Golden Palace Suppliers",
      contact: "Fatima Al-Rashid",
      phone: "+962-6-4444444",
      address: "Abdali, Amman",
    },
    cost_price_jod: 280.0,
    selling_price_jod: 350.0,
    quantity: 8,
    created: "2024-01-02",
    updated: "2024-01-14",
  },
]

export function EnhancedInventory() {
  const { t, isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [inventory] = useState(mockInventory)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newItem, setNewItem] = useState({
    id: "",
    name: "",
    type: "",
    weight_grams: "",
    karat: "",
    wholesale_vendor: {
      name: "",
      contact: "",
      phone: "",
      address: "",
    },
    cost_price_jod: "",
    selling_price_jod: "",
    quantity: "",
  })

  const itemTypes = ["Ring", "Bracelet", "Necklace", "Earrings", "Pendant", "Chain", "Bangle"]
  const karatOptions = [24, 21, 18, 14]

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddItem = () => {
    // Here you would add to PocketBase
    console.log("Adding item:", newItem)
    setShowAddDialog(false)
    // Reset form
    setNewItem({
      id: "",
      name: "",
      type: "",
      weight_grams: "",
      karat: "",
      wholesale_vendor: { name: "", contact: "", phone: "", address: "" },
      cost_price_jod: "",
      selling_price_jod: "",
      quantity: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Inventory Management</h1>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item_id">Item ID</Label>
                  <Input
                    id="item_id"
                    value={newItem.id}
                    onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
                    placeholder="ITM001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item_name">Item Name</Label>
                  <Input
                    id="item_name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Classic Gold Ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item_type">Item Type</Label>
                  <Select value={newItem.type} onValueChange={(value) => setNewItem({ ...newItem, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (grams)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={newItem.weight_grams}
                    onChange={(e) => setNewItem({ ...newItem, weight_grams: e.target.value })}
                    placeholder="5.20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="karat">Karat</Label>
                  <Select value={newItem.karat} onValueChange={(value) => setNewItem({ ...newItem, karat: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select karat" />
                    </SelectTrigger>
                    <SelectContent>
                      {karatOptions.map((karat) => (
                        <SelectItem key={karat} value={karat.toString()}>
                          {karat}K
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Wholesale Vendor Information</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor_name">Vendor Name</Label>
                    <Input
                      id="vendor_name"
                      value={newItem.wholesale_vendor.name}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          wholesale_vendor: { ...newItem.wholesale_vendor, name: e.target.value },
                        })
                      }
                      placeholder="Al-Zahra Gold Trading"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendor_contact">Contact Person</Label>
                    <Input
                      id="vendor_contact"
                      value={newItem.wholesale_vendor.contact}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          wholesale_vendor: { ...newItem.wholesale_vendor, contact: e.target.value },
                        })
                      }
                      placeholder="Ahmad Al-Zahra"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendor_phone">Phone</Label>
                    <Input
                      id="vendor_phone"
                      value={newItem.wholesale_vendor.phone}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          wholesale_vendor: { ...newItem.wholesale_vendor, phone: e.target.value },
                        })
                      }
                      placeholder="+962-6-5555555"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendor_address">Address</Label>
                    <Input
                      id="vendor_address"
                      value={newItem.wholesale_vendor.address}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          wholesale_vendor: { ...newItem.wholesale_vendor, address: e.target.value },
                        })
                      }
                      placeholder="Downtown Amman, Jordan"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost_price">Cost Price (JOD)</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    step="0.01"
                    value={newItem.cost_price_jod}
                    onChange={(e) => setNewItem({ ...newItem, cost_price_jod: e.target.value })}
                    placeholder="180.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selling_price">Selling Price (JOD)</Label>
                  <Input
                    id="selling_price"
                    type="number"
                    step="0.01"
                    value={newItem.selling_price_jod}
                    onChange={(e) => setNewItem({ ...newItem, selling_price_jod: e.target.value })}
                    placeholder="220.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    placeholder="12"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Item ID, Name, or Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items ({filteredInventory.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item ID</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Karat</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Cost Price</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.weight_grams}g</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.karat}K</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span className="text-sm">{item.wholesale_vendor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.cost_price_jod.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                  </TableCell>
                  <TableCell>
                    {item.selling_price_jod.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.quantity < 5 ? "destructive" : "default"}>{item.quantity}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
