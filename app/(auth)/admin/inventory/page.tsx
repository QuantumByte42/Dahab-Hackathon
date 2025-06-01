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
import { Package, Plus, Search, Edit, Trash2, Building2, Phone, MapPin, User } from "lucide-react"
import { submitForm } from "@/lib/submit"
import { get_inventory } from "@/lib/api"
import { InventoryKaratOptions, InventoryRecord, InventoryTypeOptions } from "@/lib/pocketbase-types"

export default function InventoryPage() {
  const { isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [inventory, setInventory] = useState<InventoryRecord[]>([])
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

  const filteredInventory = inventory.filter(
    (item) =>
      item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    const fetch = async () => {
      const inventory = await get_inventory()
      setInventory(inventory);
    }
    fetch()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddItem = async () => {
    const res = await submitForm(null, "inventory", newItem)
    if (res.record)
      console.log(res.msg)
    else
      console.error(res.msg)
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

  const handleCancelButton = () => {
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

  const handleSubmit = async () => {

  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-amber-25 via-white to-yellow-25 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            Inventory Management
          </h1>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              <Plus className="h-4 w-4" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
            <DialogHeader className="border-b border-amber-100 pb-4">
              <DialogTitle className="text-xl font-bold text-amber-800">Add New Inventory Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item_id" className="text-amber-700 font-medium">Item ID</Label>
                    <Input
                      id="item_id"
                      value={newItem.id}
                      onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
                      placeholder="QB4_00000"
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item_name" className="text-amber-700 font-medium">Item Name</Label>
                    <Input
                      id="item_name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Classic Gold Ring"
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item_type" className="text-amber-700 font-medium">Item Type</Label>
                    <Select value={newItem.type} onValueChange={(value) => setNewItem({ ...newItem, type: value })}>
                      <SelectTrigger className="border-amber-200 focus:border-amber-400 focus:ring-amber-400">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(InventoryTypeOptions).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-amber-700 font-medium">Weight (grams)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.01"
                      value={newItem.weight_grams}
                      onChange={(e) => setNewItem({ ...newItem, weight_grams: e.target.value })}
                      placeholder="5.20"
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="karat" className="text-amber-700 font-medium">Karat</Label>
                    <Select value={newItem.karat} onValueChange={(value) => setNewItem({ ...newItem, karat: value })}>
                      <SelectTrigger className="border-amber-200 focus:border-amber-400 focus:ring-amber-400">
                        <SelectValue placeholder="Select karat" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(InventoryKaratOptions).map((karat) => (
                          <SelectItem key={karat} value={karat.toString()}>
                            {karat}K
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium text-amber-800">Wholesale Vendor Information</Label>
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
                      name="cost_price"
                      type="number"
                      step="0.01"
                      value={newItem.cost_price_jod}
                      onChange={handleInputChange}
                      placeholder="180.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="selling_price">Selling Price (JOD)</Label>
                    <Input
                      id="selling_price"
                      name="selling_price"
                      type="number"
                      step="0.01"
                      value={newItem.selling_price_jod}
                      onChange={handleInputChange}
                      placeholder="220.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={newItem.quantity}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-amber-100">
                <Button 
                  variant="outline" 
                  onClick={handleCancelButton}
                  className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddItem}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Add Item
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
            <Input
              placeholder="Search by Item ID, Name, or Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-amber-200 focus:ring-amber-400 focus:border-amber-400 bg-white/70"
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Inventory Table */}
      <Card className="border-amber-200 bg-gradient-to-br from-white to-amber-50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold">
            Inventory Items ({filteredInventory.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
              {filteredInventory.map((inventory) => (
                <TableRow key={inventory.id}>
                  <TableCell className="font-mono text-sm">{inventory.item_id}</TableCell>
                  <TableCell className="font-medium">{inventory.item_name}</TableCell>
                  <TableCell>{inventory.type}</TableCell>
                  <TableCell>{inventory.weight}g</TableCell>
                  <TableCell>
                    <Badge variant="outline">{inventory.karat}K</Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span className="text-sm">{inventory.vendor_name}</span>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Vendor Information</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-start justify-center space-y-2 p-2">
                          <div className="flex items-center gap-2 text-lg font-medium">
                          <Building2 className="h-5 w-5" />
                          {inventory.vendor_name}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {inventory.vendor_phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {inventory.vendor_address}
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {inventory.vendor_contact_person}
                          </div>
                          </div>
                        </div>
                      </DialogContent>
                  </Dialog>
                  </TableCell>
                  <TableCell>
                    {inventory.cost_price?.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                  </TableCell>
                  <TableCell>
                    {inventory.selling_price?.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={inventory.quantity && inventory.quantity < 5 ? "destructive" : "default"}>{inventory.quantity}</Badge>
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
