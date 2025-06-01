"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { ShoppingCart, Plus, Trash2, Calculator, ArrowLeft } from "lucide-react"
import { InventoryItemTypeOptions, InventoryKaratOptions, InvoicesRecord } from "@/lib/pocketbase-types"
import { get_item, create_invoice, update_inventory_quantity, validate_inventory_availability } from "@/lib/api"
import InvoicePrint from "@/components/invoice-print"

export default function SalesPage() {
  const { isRTL } = useLanguage()
  const [customer, setCustomer] = useState({
    name: "",
    phone: ""
  })
  const [transactionType, setTransactionType] = useState("")
  const [saleItems, setSaleItems] = useState<Array<{
    item_id: string;
    item_name: string;
    type: string;
    weight: number;
    karat: string;
    selling_price: number;
    making_charges: number;
    quantity: number;
  }>>([]);
  
  const [isCurretItem, setIsCurrentItem] = useState(false)
  const [currentItem, setCurrentItem] = useState({
    item_id: "",
    item_name: "",
    type: "",
    weight: "",
    karat: "",
    selling_price: "",
    quantity: "1",
  })
  const [outOfStock, setOutOfStock] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [showInvoice, setShowInvoice] = useState(false)
  const [completedInvoice, setCompletedInvoice] = useState< InvoicesRecord | null>(null)

  useEffect(() => {
    const fetch = async () => {
      setIsCurrentItem(false)
      const item = await get_item(currentItem.item_id);
      if(!item)
        return ;  
      setIsCurrentItem(true)
      setCurrentItem({
        item_id: item.item_id || "",
        item_name: item.item_name || "",
        type: item.item_type || "",
        weight: item.weight ? item.weight.toString() : "",
        karat: item.karat ? item.karat.toString().replace('E', '') : "",
        selling_price: item.selling_price ? item.selling_price.toString() : "",
        quantity: (item.quantity ?? 0) > 0 ? "1" : "0",
      })
      setOutOfStock((item.quantity ?? 0) <= 0)
    }
    fetch()
    console.log(`currentItemId: ${currentItem.item_id}`)
  }, [currentItem.item_id])

  // Auto-calculate making charges (typically 10-15% of selling price)
  const calculateMakingCharges = (sellingPrice: number) => {
    return sellingPrice * 0.12 // 12% making charges
  }

  const addItemToSale = () => {
    if (!currentItem.item_id || !currentItem.selling_price) return

    const sellingPrice = Number.parseFloat(currentItem.selling_price)
    const makingCharges = calculateMakingCharges(sellingPrice)

    

    const newItem = {
      item_id: currentItem.item_id,
      item_name: currentItem.item_name,
      type: currentItem.type,
      weight: Number.parseFloat(currentItem.weight),
      karat: `E${currentItem.karat}`,
      selling_price: sellingPrice,
      making_charges: makingCharges,
      quantity: Number.parseInt(currentItem.quantity),
    }

    setSaleItems([...saleItems, newItem])

    // Reset current item form
    setCurrentItem({
      item_id: "",
      item_name: "",
      type: "",
      weight: "",
      karat: "",
      selling_price: "",
      quantity: "1",
    })
    setIsCurrentItem(false)
  }

  const removeItemFromSale = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index))
  }

  const calculateTotals = () => {
    const subtotal = saleItems.reduce((sum, item) => sum + item.selling_price * item.quantity, 0)
    const totalMakingCharges = saleItems.reduce((sum, item) => sum + item.making_charges * item.quantity, 0)
    const totalAmount = subtotal + totalMakingCharges

    return { subtotal, totalMakingCharges, totalAmount }
  }

  const { subtotal, totalMakingCharges, totalAmount } = calculateTotals()

  const handleCompleteSale = async () => {
    if (saleItems.length === 0) return
    setLoading(true)
    try {
      // 1. Validate inventory availability
      const inventoryValidation = await validate_inventory_availability(
        saleItems.map(item => ({ item_id: item.item_id, quantity: item.quantity }))
      )
      
      const invalidItems = inventoryValidation.filter(v => !v.valid)
      if (invalidItems.length > 0) {
        alert(`Inventory validation failed:\n${invalidItems.map(item => item.message).join('\n')}`)
        setLoading(false)
        return
      }

      // 2. Create invoice
      const invoiceNumber = `INV-${Date.now()}`
      const invoiceData = {
        No: invoiceNumber,
        customer_name: customer.name,
        customer_phone: customer.phone, 
        items: saleItems,
        subtotal,
        tax: 0, // No tax calculation for now
        total_amount: totalAmount,
        payment_method: transactionType.toLowerCase(),
        payment_status: "paid",
        notes: `Sale created at ${new Date().toLocaleString()}`,
        making_charges: totalMakingCharges,
      }

      const invoice = await create_invoice(invoiceData)
      
      if (!invoice) {
        alert("Failed to create invoice")
        setLoading(false)
        return
      }

      // 3. Update inventory quantities
      for (const item of saleItems) {
        try {
          await update_inventory_quantity(item.item_id, item.quantity)
        } catch (error) {
          console.error(`Failed to update inventory for ${item.item_id}:`, error)
          // Note: You might want to implement a rollback mechanism here
        }
      }

      // 4. Store completed invoice data for PDF generation
      setCompletedInvoice(invoice)

      // Show invoice print view
      setShowInvoice(true)

      // 6. Clear the form
      setSaleItems([])
      setCustomer({name: "", phone: ""})
      setTransactionType("")
      setCurrentItem({
        item_id: "",
        item_name: "",
        type: "",
        weight: "",
        karat: "",
        selling_price: "",
        quantity: "1",
      })
      
    } catch (error) {
      console.error("Error completing sale:", error)
      alert("Failed to complete sale. Please try again.")
    }
    setLoading(false)
  }

  const handleBackToSale = () => {
    setShowInvoice(false)
    setCompletedInvoice(null)
  }

  // TODO remove this testing
  // useEffect(() => {
  //   const fetch = async () => {
  //     try {
  //       const pb = getPocketBase()
  //       const invoice = await pb.collection("invoices").getOne<InvoicesRecord>("t5d1oet37646k7z")
  //       setCompletedInvoice(invoice);
  //       setShowInvoice(true)
  //     } catch {}
  //   }
  //   fetch()
  // }, [])

  // If showing invoice, render the invoice print component
  if (showInvoice && completedInvoice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button onClick={handleBackToSale} variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to New Sale
          </Button>
          <h1 className="text-3xl font-bold">Invoice Generated</h1>
        </div>

        <InvoicePrint invoice={completedInvoice} />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-amber-25 via-white to-yellow-25 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            Sales Transaction
          </h1>
        </div>
        <div className="text-sm text-amber-600 font-medium px-4 py-2 bg-amber-50 rounded-lg border border-amber-200">
          {new Date().toLocaleString(isRTL ? "ar-JO" : "en-US")}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Information */}
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Customer Name</Label>
              <Input
                id="customer_name"
                value={customer.name}
                onChange={(e) => setCustomer(prev  => ({...prev, name: e.target.value}))}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_phone">Phone (Optional)</Label>
              <Input
                id="customer_phone"
                value={customer.phone}
                onChange={(e) => setCustomer(prev  => ({...prev, phone: e.target.value}))}
                placeholder="+962-XX-XXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction_type">Transaction Type</Label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add Item Form */}
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Item to Sale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="item_id">Item ID</Label>
              <Input
                id="item_id"
                value={currentItem.item_id}
                onChange={(e) => setCurrentItem(prev => ({...prev, item_id: e.target.value}))}
                placeholder="QB4_00000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item_name">Item Name</Label>
              <Input
                id="item_name"
                value={currentItem.item_name}
                disabled={true}
                onChange={(e) => setCurrentItem({ ...currentItem, item_name: e.target.value })}
                placeholder="Classic Gold Ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="item_type">Type</Label>
                <Select
                  disabled={true}
                  value={currentItem.type}
                  onValueChange={(value) => setCurrentItem({ ...currentItem, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
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
                <Label htmlFor="karat">Karat</Label>
                <Select
                  value={currentItem.karat}
                  disabled={true}
                  onValueChange={(value) => setCurrentItem({ ...currentItem, karat: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Karat" />
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
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (g)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  disabled={!isCurretItem || outOfStock}
                  value={currentItem.weight}
                  onChange={(e) => setCurrentItem({ ...currentItem, weight: e.target.value })}
                  placeholder="5.20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Qty</Label>
                <Input
                  id="quantity"
                  type="number"
                  disabled={!isCurretItem || outOfStock}
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                  placeholder="1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="selling_price">Selling Price (JOD)</Label>
              <Input
                id="selling_price"
                type="number"
                step="0.01"
                disabled={!isCurretItem || outOfStock}
                value={currentItem.selling_price}
                onChange={(e) => setCurrentItem({ ...currentItem, selling_price: e.target.value })}
                placeholder="220.00"
              />
            </div>
            {currentItem.selling_price && (
              <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg shadow-sm">
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-700 font-medium">Making Charges (12%):</span>
                    <span className="font-bold text-amber-800">{calculateMakingCharges(Number.parseFloat(currentItem.selling_price)).toFixed(2)} JOD</span>
                  </div>
                </div>
              </div>
            )}
            <Button 
                onClick={addItemToSale} 
                className="w-full gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg transition-all duration-200"
                disabled={!isCurretItem || outOfStock}>
                {outOfStock ? (
                  <>Out of stock</>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Item
                  </>
                )}
            </Button>
          </CardContent>
        </Card>

        {/* Sale Summary */}
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Sale Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Items:</span>
                <span>{saleItems.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{subtotal.toFixed(2)} JOD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Making Charges:</span>
                <span>{totalMakingCharges.toFixed(2)} JOD</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span>{totalAmount.toFixed(2)} JOD</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Button
                onClick={handleCompleteSale}
                className="w-full gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg transition-all duration-200"
                disabled={saleItems.length === 0 || !customer.name || !transactionType || loading}
              >
                <Calculator className="h-4 w-4" />
                {loading ? "Processing..." : "Complete Sale"}
              </Button>
              {/* <Button
                onClick={printInvoice}
                variant="outline"
                className="w-full gap-2"
                disabled={saleItems.length === 0}
              >
                <Printer className="h-4 w-4" />
                Print Invoice
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items in Current Sale */}
      {saleItems.length > 0 && (
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Items in Current Sale ({saleItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Karat</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Making</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saleItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{item.item_id}</TableCell>
                    <TableCell>{item.item_name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.karat}K</Badge>
                    </TableCell>
                    <TableCell>{item.weight}g</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.selling_price.toFixed(2)} JOD</TableCell>
                    <TableCell>{item.making_charges.toFixed(2)} JOD</TableCell>
                    <TableCell className="font-medium">
                      {((item.selling_price + item.making_charges) * item.quantity).toFixed(2)} JOD
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => removeItemFromSale(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
