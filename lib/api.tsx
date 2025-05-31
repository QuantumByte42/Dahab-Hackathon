import { getPocketBase } from "./pocketbase";
import { CustomersRecord, InventoryRecord, InvoicesRecord } from "./pocketbase-types";

export async function get_customers() {
    const pb = getPocketBase()

    const records = await pb.collection("customers")
                            .getList<CustomersRecord>(1, 50);
    if (records.totalItems > 0)
        return (records.items)
    return ([])
}

export async function get_inventory() {
    const pb = getPocketBase()

    const records = await pb.collection("inventory")
                            .getList<InventoryRecord>(1, 50, {
                                expand: "vendor"
                            });
    if (records.totalItems > 0)
        return (records.items)
    return ([])
}

export async function get_item(itemId: string) {
    const pb = getPocketBase()

    try {
        // First try to find by item_id if it exists
        try {
            const item = await pb.collection("inventory")
                    .getFirstListItem<InventoryRecord>(`item_id = '${itemId}'`)
            return (item)
        } catch {
            // If item_id doesn't exist, try by id
            const item = await pb.collection("inventory")
                    .getOne<InventoryRecord>(itemId)
            return (item)
        }
    } catch {
        return (null)
    }
}

export async function create_customer(customerData: Partial<CustomersRecord>) {
    const pb = getPocketBase()
    
    try {
        // Check if customer already exists by phone or email
        let existingCustomer = null;
        if (customerData.phone) {
            try {
                existingCustomer = await pb.collection("customers")
                    .getFirstListItem<CustomersRecord>(`phone = '${customerData.phone}'`)
            } catch {
                // Customer doesn't exist, which is fine
            }
        }
        
        if (existingCustomer) {
            return existingCustomer;
        }
        
        const record = await pb.collection("customers").create<CustomersRecord>(customerData)
        return record
    } catch (error) {
        console.error("Error creating customer:", error)
        return null
    }
}

export async function create_invoice(invoiceData: Partial<InvoicesRecord>) {
    const pb = getPocketBase()
    
    try {
        const record = await pb.collection("invoices").create<InvoicesRecord>(invoiceData)
        return record
    } catch (error) {
        console.error("Error creating invoice:", error)
        return null
    }
}

export async function update_inventory_quantity(itemId: string, quantitySold: number) {
    const pb = getPocketBase()
    
    try {
        // Get current item - try both item_id and id fields
        let item: InventoryRecord | null = null;
        
        try {
            item = await pb.collection("inventory")
                .getFirstListItem<InventoryRecord>(`item_id = '${itemId}'`)
        } catch {
            // If item_id doesn't work, try by id
            item = await pb.collection("inventory").getOne<InventoryRecord>(itemId)
        }
        
        if (!item) {
            throw new Error(`Item with ID ${itemId} not found`)
        }
        
        if (item.quantity < quantitySold) {
            throw new Error(`Insufficient inventory. Available: ${item.quantity}, Requested: ${quantitySold}`)
        }
        
        // Update quantity
        const newQuantity = item.quantity - quantitySold
        const updatedItem = await pb.collection("inventory").update(item.id, {
            quantity: newQuantity
        })
        
        return updatedItem
    } catch (error) {
        console.error("Error updating inventory:", error)
        throw error
    }
}

export async function get_invoices() {
    const pb = getPocketBase()

    try {
        const records = await pb.collection("invoices")
                                .getList<InvoicesRecord>(1, 50, {
                                    expand: "customer",
                                    sort: "-created"
                                });
        if (records.totalItems > 0)
            return (records.items)
        return ([])
    } catch (error) {
        console.error("Error fetching invoices:", error)
        return ([])
    }
}

export async function validate_inventory_availability(items: Array<{item_id: string, quantity: number}>) {    
    try {
        const validationResults = []
        
        for (const item of items) {
            const inventoryItem = await get_item(item.item_id)
            if (!inventoryItem) {
                validationResults.push({
                    item_id: item.item_id,
                    valid: false,
                    message: `Item ${item.item_id} not found in inventory`
                })
                continue
            }
            
            if (inventoryItem.quantity < item.quantity) {
                validationResults.push({
                    item_id: item.item_id,
                    valid: false,
                    message: `Insufficient inventory for ${item.item_id}. Available: ${inventoryItem.quantity}, Requested: ${item.quantity}`
                })
                continue
            }
            
            validationResults.push({
                item_id: item.item_id,
                valid: true,
                message: "OK"
            })
        }
        
        return validationResults
    } catch (error) {
        console.error("Error validating inventory:", error)
        return []
    }
}

// Transform invoice data to transaction format
interface TransactionData {
    id: string
    sale_id: string
    customer_name: string
    customer_phone?: string
    gold_type: string
    karat: number
    weight_grams: number
    price_per_gram_jod: number
    total_amount_jod: number
    payment_method: string
    created: string
}

export async function get_transactions(): Promise<TransactionData[]> {
    const pb = getPocketBase()
    
    try {
        const invoices = await pb.collection("invoices")
                                .getList<InvoicesRecord>(1, 100, {
                                    expand: "customer",
                                    sort: "-created"
                                });
        
        const transactions: TransactionData[] = []
        
        for (const invoice of invoices.items) {
            const customer = invoice.expand?.customer
            const items = (invoice.items as unknown as Array<{
                item_id?: string;
                item_name?: string;
                type?: string;
                weight?: number;
                karat?: string;
                selling_price?: number;
                making_charges?: number;
                quantity?: number;
            }>) || []
            
            // If invoice has multiple items, create one transaction per item
            if (items.length > 0) {
                for (const item of items) {
                    const sellingPrice = item.selling_price || 0
                    const makingCharges = item.making_charges || 0
                    const weight = item.weight || 1
                    const quantity = item.quantity || 1
                    
                    const pricePerGram = weight > 0 ? (sellingPrice + makingCharges) / weight : 0
                    
                    transactions.push({
                        id: `${invoice.id}_${item.item_id || items.indexOf(item)}`,
                        sale_id: invoice.id,
                        customer_name: customer?.name || "Unknown Customer",
                        customer_phone: customer?.phone,
                        gold_type: item.item_name || item.type || "Gold Item",
                        karat: parseInt(item.karat?.toString().replace(/[^0-9]/g, '') || '21'),
                        weight_grams: weight,
                        price_per_gram_jod: pricePerGram,
                        total_amount_jod: (sellingPrice + makingCharges) * quantity,
                        payment_method: invoice.type || "cash",
                        created: invoice.created || new Date().toISOString()
                    })
                }
            } else {
                // If no items array, create one transaction for the whole invoice
                transactions.push({
                    id: invoice.id,
                    sale_id: invoice.id,
                    customer_name: customer?.name || "Unknown Customer",
                    customer_phone: customer?.phone,
                    gold_type: "Multiple Items",
                    karat: 21, // Default
                    weight_grams: 0,
                    price_per_gram_jod: 0,
                    total_amount_jod: invoice.total_amount || 0,
                    payment_method: invoice.type || "cash",
                    created: invoice.created || new Date().toISOString()
                })
            }
        }
        
        return transactions
    } catch (error) {
        console.error("Error fetching transactions:", error)
        return []
    }
}
