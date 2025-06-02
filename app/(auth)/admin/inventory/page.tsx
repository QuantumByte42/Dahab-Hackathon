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
import { Package, Plus, Search, Edit, Trash2, Building2, Phone, MapPin, User, DollarSign, AlertTriangle, Weight, Hash } from "lucide-react"
import { submitForm } from "@/lib/submit"
import { get_inventory } from "@/lib/api"
import { InventoryItemTypeOptions, InventoryKaratOptions, InventoryRecord } from "@/lib/pocketbase-types"
import { getPocketBase } from "@/lib/pocketbase"
import { toast } from "react-toastify"

const messages = {
  loading: "",
  success_add: "",
  error_add: "",
  success_delete: "",
  error_delete: "",
}

export default function InventoryPage() {
  const { isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [inventory, setInventory] = useState<InventoryRecord[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockCount: 0,
    totalWeight: 0
  })
  const [newItem, setNewItem] = useState({
    id: "",
    item_id: "QB4_00005",
    item_name: "test",
    item_type: "Ring",
    weight: "5.1",
    karat: "21",
    cost_price: "150",
    selling_price: "180",
    quantity: "5",
    vendor_name: "test",
    vendor_phone: "test",
    vendor_address: "test",
    vendor_contact_person: "test",
  })

<<<<<<< HEAD
  useEffect(() => {
    const fetch = async () => {
      let filter = ""
      if (searchTerm !== undefined)
          filter = `item_name ~ '${searchTerm}' || item_type ~ '${searchTerm}' || item_id ~ '${searchTerm}'`
      const inventory = await get_inventory(filter)
      setInventory(inventory);
=======
  const filteredInventory = inventory.filter(
    (item) =>
      item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item_id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate inventory statistics
  const calculateStats = (inventoryData: InventoryRecord[]) => {
    const stats = {
      totalItems: inventoryData.length,
      totalValue: inventoryData.reduce((sum, item) => sum + ((item.cost_price || 0) * (item.quantity || 0)), 0),
      lowStockCount: inventoryData.filter(item => (item.quantity || 0) <= 5).length,
      totalWeight: inventoryData.reduce((sum, item) => sum + ((item.weight || 0) * (item.quantity || 0)), 0)
    }
    setInventoryStats(stats)
  }

  useEffect(() => {
    const fetch = async () => {
      const inventory = await get_inventory()
      setInventory(inventory)
      calculateStats(inventory)
>>>>>>> refs/remotes/origin/main
    }
    fetch()
  }, [searchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
     // Show loading toast
    const loadingToastId = toast.loading(messages.loading, {
      position: isRTL ? "top-left" : "top-right",
    })
    const res = await submitForm(null, "inventory", newItem)
<<<<<<< HEAD
    toast.update(loadingToastId, {
      render: res.record ? messages.success_add : messages.error_add,
      type: res.record ? "success" : "error",
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
    })

    // TODO add new item to inventory

=======
    if (res.record)
    {
      // Refresh inventory data
      const updatedInventory = await get_inventory()
      setInventory(updatedInventory)
      calculateStats(updatedInventory)
      console.log(res.msg)
    }
    else
      console.error(res.msg)
>>>>>>> refs/remotes/origin/main

    setShowAddDialog(false)
    // Reset form
    setNewItem({
      id: "",
      item_id: "",
      item_name: "",
      item_type: "",
      weight: "",
      karat: "",
      cost_price: "",
      selling_price: "",
      quantity: "",
      vendor_name: "",
      vendor_phone: "",
      vendor_address: "",
      vendor_contact_person: "",
    })
  }

  const handleCancelButton = () => {
    setShowAddDialog(false)
    // Reset form
    setNewItem({
      id: "",
      item_id: "",
      item_name: "",
      item_type: "",
      weight: "",
      karat: "",
      cost_price: "",
      selling_price: "",
      quantity: "",
      vendor_name: "",
      vendor_phone: "",
      vendor_address: "",
      vendor_contact_person: "",
    })
  }

  const handleRemoveItemInventory = async (item: InventoryRecord) => {
    const pb = getPocketBase()

    // Show loading toast
    const loadingToastId = toast.loading(messages.loading, {
      position: isRTL ? "top-left" : "top-right",
    })
    try {
      await pb.collection("inventory").delete(item.id)
<<<<<<< HEAD

      toast.update(loadingToastId, {
        render: messages.success_delete,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
      })
      // TODO remove item from inventory
      // setInventory(inventory.filter((_item, i) => {_item.id !== item.id}))
=======
      // Refresh inventory data
      const updatedInventory = await get_inventory()
      setInventory(updatedInventory)
      calculateStats(updatedInventory)
      console.log("success remove item")
>>>>>>> refs/remotes/origin/main
    } catch {
      toast.update(loadingToastId, {
        render: messages.error_delete,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
      })
    }
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
                      name="item_id"
                      value={newItem.item_id}
                      onChange={handleInputChange}
                      placeholder="QB4_00000"
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item_name" className="text-amber-700 font-medium">Item Name</Label>
                    <Input
                      id="item_name"
                      name="item_name"
                      value={newItem.item_name}
                      onChange={handleInputChange}
                      placeholder="Classic Gold Ring"
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item_type" className="text-amber-700 font-medium">Item Type</Label>
                    <Select name="type" onValueChange={(value) => setNewItem({ ...newItem, item_type: value })}>
                      <SelectTrigger className="border-amber-200 focus:border-amber-400 focus:ring-amber-400">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(InventoryItemTypeOptions).map((type) => (
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
                      name="weight"
                      type="number"
                      step="0.01"
                      value={newItem.weight}
                      onChange={handleInputChange}
                      placeholder="5.20"
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                      required
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
                        name="vendor_name"
                        value={newItem.vendor_name}
                        onChange={handleInputChange}
                        placeholder="Al-Zahra Gold Trading"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vendor_contact_person">Contact Person</Label>
                      <Input
                        id="vendor_contact_person"
                        name="vendor_contact_person"
                        value={newItem.vendor_contact_person}
                        onChange={handleInputChange}
                        placeholder="Ahmad Al-Zahra"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vendor_phone">Phone</Label>
                      <Input
                        id="vendor_phone"
                        name="vendor_phone"
                        value={newItem.vendor_phone}
                        onChange={handleInputChange}
                        placeholder="+962-6-5555555"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vendor_address">Address</Label>
                      <Input
                        id="vendor_address"
                        name="vendor_address"
                        value={newItem.vendor_address}
                        onChange={handleInputChange}
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
                      value={newItem.cost_price}
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
                      value={newItem.selling_price}
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
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Add Item
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Inventory Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Items</p>
                <p className="text-2xl font-bold text-blue-800">{inventoryStats.totalItems}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl">
                <Hash className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold text-green-800">${inventoryStats.totalValue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-400 to-green-500 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Total Weight</p>
                <p className="text-2xl font-bold text-amber-800">{inventoryStats.totalWeight.toFixed(2)}g</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl">
                <Weight className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-800">{inventoryStats.lowStockCount}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-400 to-red-500 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
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
            Inventory Items ({inventory.length})
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
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.item_id}</TableCell>
                  <TableCell className="font-medium">{item.item_name}</TableCell>
                  <TableCell>{item.item_type}</TableCell>
                  <TableCell>{item.weight}g</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.karat}K</Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span className="text-sm">{item.vendor_name}</span>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Vendor Information</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-start justify-center space-y-2 p-2">
                          <div className="flex items-center gap-2 text-lg font-medium">
                          <Building2 className="h-5 w-5" />
                          {item.vendor_name}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {item.vendor_phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {item.vendor_address}
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {item.vendor_contact_person}
                          </div>
                          </div>
                        </div>
                      </DialogContent>
                  </Dialog>
                  </TableCell>
                  <TableCell>
                    {item.cost_price?.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                  </TableCell>
                  <TableCell>
                    {item.selling_price?.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.quantity && item.quantity < 5 ? "destructive" : "default"}>{item.quantity}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={async () => {await handleRemoveItemInventory(item)}}>
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
