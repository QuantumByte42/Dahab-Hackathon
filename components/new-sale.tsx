"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { Calculator, Save, Plus, Minus, Search } from "lucide-react"
import { get_inventory, create_customer, create_invoice, update_inventory_quantity, validate_inventory_availability } from "@/lib/api"
import { InventoryRecord, InvoicesTypeOptions } from "@/lib/pocketbase-types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CartItem {
  inventory_item: InventoryRecord
  quantity: number
  selling_price: number
  making_charges: number
}

export function NewSale() {
  const { t, isRTL } = useLanguage()
  const [inventory, setInventory] = useState<InventoryRecord[]>([])
  const [filteredInventory, setFilteredInventory] = useState<InventoryRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  })
  const [paymentMethod, setPaymentMethod] = useState<InvoicesTypeOptions>(InvoicesTypeOptions.cash)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchInventory() {
      try {
        const data = await get_inventory()
        setInventory(data)
        setFilteredInventory(data)
      } catch (error) {
        console.error("Error fetching inventory:", error)
      }
    }
    
    fetchInventory()
  }, [])

  useEffect(() => {
    const filtered = inventory.filter(
      (item) =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredInventory(filtered)
  }, [searchTerm, inventory])

  const addToCart = (item: InventoryRecord) => {
    const existingItem = cart.find(cartItem => cartItem.inventory_item.id === item.id)
    
    if (existingItem) {
      if (existingItem.quantity < item.quantity!) {
        setCart(cart.map(cartItem => 
          cartItem.inventory_item.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ))
      } else {
        alert("Insufficient inventory")
      }
    } else {
      if (item.quantity! > 0) {
        setCart([...cart, {
          inventory_item: item,
          quantity: 1,
          selling_price: item.selling_price || 0,
          making_charges: 0
        }])
      } else {
        alert("Item out of stock")
      }
    }
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.inventory_item.id !== itemId))
  }

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    const cartItem = cart.find(item => item.inventory_item.id === itemId)
    if (cartItem && quantity <= cartItem.inventory_item.quantity!) {
      setCart(cart.map(item => 
        item.inventory_item.id === itemId 
          ? { ...item, quantity }
          : item
      ))
    }
  }

  const updateCartItemPrice = (itemId: string, selling_price: number, making_charges: number) => {
    setCart(cart.map(item => 
      item.inventory_item.id === itemId 
        ? { ...item, selling_price, making_charges }
        : item
    ))
  }

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.selling_price * item.quantity)
    }, 0)
  }

  const calculateMakingCharges = () => {
    return cart.reduce((total, item) => {
      return total + (item.making_charges * item.quantity)
    }, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateMakingCharges()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (cart.length === 0) {
      alert("Please add items to cart")
      return
    }

    if (!customerData.name) {
      alert("Please enter customer name")
      return
    }

    setLoading(true)

    try {
      // Validate inventory availability
      const items = cart.map(cartItem => ({
        item_id: cartItem.inventory_item.item_id,
        quantity: cartItem.quantity
      }))

      const validationResults = await validate_inventory_availability(items)
      const invalidItems = validationResults.filter(result => !result.valid)
      
      if (invalidItems.length > 0) {
        alert(`Inventory validation failed:\n${invalidItems.map(item => item.message).join('\n')}`)
        setLoading(false)
        return
      }

      // Create or get customer
      const customer = await create_customer(customerData)
      if (!customer) {
        alert("Failed to create customer")
        setLoading(false)
        return
      }

      // Generate invoice number - ensure it matches PocketBase regex pattern
      // Current pattern: "INV-^[0-9]+$" (which is actually invalid regex)
      // Let's use a format that should work: INV-[timestamp]
      const timestamp = Date.now()
      const invoiceNo = `INV-${timestamp}`

      // Prepare invoice items
      const invoiceItems = cart.map(cartItem => ({
        item_id: cartItem.inventory_item.item_id,
        item_name: cartItem.inventory_item.item_name,
        type: cartItem.inventory_item.type,
        weight: cartItem.inventory_item.weight,
        karat: cartItem.inventory_item.karat,
        quantity: cartItem.quantity,
        selling_price: cartItem.selling_price,
        making_charges: cartItem.making_charges
      }))
      
      // Calculate totals
      const subtotal = calculateSubtotal()
      const makingCharges = calculateMakingCharges()
      const totalAmount = calculateTotal()
      
      console.log('Creating invoice with data:', {
        No: invoiceNo,
        customer: customer.id,
        type: paymentMethod,
        items: invoiceItems,
        subtotal: subtotal,
        making_charges: makingCharges,
        total_amount: totalAmount
      })

      // Create invoice - ensure all required fields are included
      const invoiceData = {
        No: invoiceNo,
        customer: customer.id,
        type: paymentMethod,
        items: invoiceItems,
        subtotal: Number(subtotal.toFixed(2)),
        making_charges: Number(makingCharges.toFixed(2)),
        total_amount: Number(totalAmount.toFixed(2))
      }
      
      console.log('Final invoice data being sent:', invoiceData)
      const invoice = await create_invoice(invoiceData)

      if (!invoice) {
        alert("Failed to create invoice")
        setLoading(false)
        return
      }

      // Update inventory quantities
      for (const cartItem of cart) {
        await update_inventory_quantity(cartItem.inventory_item.item_id, cartItem.quantity)
      }

      alert(`Sale completed successfully! Invoice: ${invoiceNo}`)
      
      // Reset form
      setCart([])
      setCustomerData({ name: "", phone: "", email: "", address: "" })
      setPaymentMethod(InvoicesTypeOptions.cash)
      
      // Refresh inventory
      const updatedInventory = await get_inventory()
      setInventory(updatedInventory)
      setFilteredInventory(updatedInventory)

    } catch (error) {
      console.error("Error completing sale:", error)
      alert("Failed to complete sale. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calculator className="h-6 w-6" />
        <h1 className="text-3xl font-bold">{t("newSale")}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inventory Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Items</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {filteredInventory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.item_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.type} • {item.karat}K • {item.weight}g • Stock: {item.quantity}
                    </div>
                    <div className="text-sm font-medium">
                      {item.selling_price?.toFixed(2)} JOD
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => addToCart(item)}
                    disabled={!item.quantity || item.quantity <= 0}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cart and Customer Details */}
        <div className="space-y-6">
          {/* Cart */}
          <Card>
            <CardHeader>
              <CardTitle>Cart ({cart.length} items)</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No items in cart</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((cartItem) => (
                    <div key={cartItem.inventory_item.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{cartItem.inventory_item.item_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {cartItem.inventory_item.type} • {cartItem.inventory_item.karat}K
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => removeFromCart(cartItem.inventory_item.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div>
                          <Label className="text-xs">Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            max={cartItem.inventory_item.quantity}
                            value={cartItem.quantity}
                            onChange={(e) => updateCartItemQuantity(
                              cartItem.inventory_item.id, 
                              parseInt(e.target.value) || 1
                            )}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Selling Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={cartItem.selling_price}
                            onChange={(e) => updateCartItemPrice(
                              cartItem.inventory_item.id,
                              parseFloat(e.target.value) || 0,
                              cartItem.making_charges
                            )}
                            className="h-8"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <Label className="text-xs">Making Charges</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={cartItem.making_charges}
                          onChange={(e) => updateCartItemPrice(
                            cartItem.inventory_item.id,
                            cartItem.selling_price,
                            parseFloat(e.target.value) || 0
                          )}
                          className="h-8"
                        />
                      </div>
                      
                      <div className="text-right mt-2 font-medium">
                        Subtotal: {((cartItem.selling_price + cartItem.making_charges) * cartItem.quantity).toFixed(2)} JOD
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{calculateSubtotal().toFixed(2)} JOD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Making Charges:</span>
                      <span>{calculateMakingCharges().toFixed(2)} JOD</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{calculateTotal().toFixed(2)} JOD</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_name">Name *</Label>
                  <Input
                    id="customer_name"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    placeholder="Customer name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customer_phone">Phone</Label>
                  <Input
                    id="customer_phone"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="customer_email">Email</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                  placeholder="Email address"
                />
              </div>
              
              <div>
                <Label htmlFor="customer_address">Address</Label>
                <Input
                  id="customer_address"
                  value={customerData.address}
                  onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                  placeholder="Address"
                />
              </div>

              <div>
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(value: InvoicesTypeOptions) => setPaymentMethod(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={InvoicesTypeOptions.cash}>Cash</SelectItem>
                    <SelectItem value={InvoicesTypeOptions.credit}>Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Complete Sale */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setCart([])}>
              Clear Cart
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="gap-2"
              disabled={loading || cart.length === 0}
            >
              <Save className="h-4 w-4" />
              {loading ? "Processing..." : "Complete Sale"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
