import { getPocketBase } from "./pocketbase";
import { InventoryRecord, InvoicesRecord, InvoicesResponse, InvoicesTypeOptions } from "./pocketbase-types";

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

export async function get_item(itemId: string): Promise<InventoryRecord | null> {
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
        return null
    }
}

export async function create_invoice(invoiceData: Partial<InvoicesRecord>) {
    const pb = getPocketBase()
    
    try {
        console.log('Attempting to create invoice with data:', invoiceData)
        
        // Ensure all required fields are present and properly formatted
        const formattedData = {
            ...invoiceData,
            // Ensure numeric fields are properly formatted
            subtotal: invoiceData.subtotal ? Number(invoiceData.subtotal) : 0,
            making_charges: invoiceData.making_charges ? Number(invoiceData.making_charges) : 0,
            total_amount: invoiceData.total_amount ? Number(invoiceData.total_amount) : 0,
            // Ensure type is a string value matching PocketBase options
            type: invoiceData.type === InvoicesTypeOptions.credit ? 'credit' : 'cash',
            // Ensure items is properly formatted
            items: invoiceData.items || []
        }
        
        console.log('Formatted invoice data:', formattedData)
        
        const record = await pb.collection("invoices").create<InvoicesRecord>(formattedData)
        console.log('Invoice created successfully:', record)
        return record
    } catch (error) {
        console.error("Error creating invoice:", error)
        console.error("Invoice data that failed:", invoiceData)
        
        // Log detailed error information
        if (error && typeof error === 'object' && 'response' in error) {
            const responseError = error as { response?: { data?: unknown } }
            if (responseError.response?.data) {
                console.error("PocketBase error details:", responseError.response.data)
            }
        }
        if (error && typeof error === 'object' && 'data' in error) {
            console.error("Error data:", (error as { data: unknown }).data)
        }
        
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
        
        const itemQuantity = item.quantity ?? 0
        if (itemQuantity < quantitySold) {
            throw new Error(`Insufficient inventory. Available: ${itemQuantity}, Requested: ${quantitySold}`)
        }
        
        // Update quantity
        const newQuantity = itemQuantity - quantitySold
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
            
            const inventoryQuantity = inventoryItem.quantity ?? 0
            if (inventoryQuantity < item.quantity) {
                validationResults.push({
                    item_id: item.item_id,
                    valid: false,
                    message: `Insufficient inventory for ${item.item_id}. Available: ${inventoryQuantity}, Requested: ${item.quantity}`
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

export async function get_admins() {
    const pb = getPocketBase()

    try {
        const records = await pb.collection("admins")
                                .getList(1, 50);
        if (records.totalItems > 0)
            return (records.items)
        return ([])
    } catch (error) {
        console.error("Error fetching employees:", error)
        return ([])
    }
}

export async function create_admin(adminData: Record<string, unknown>) {
    const pb = getPocketBase()
    
    try {
        const record = await pb.collection("admins").create(adminData)
        return record
    } catch (error) {
        console.error("Error creating admin:", error)
        return null
    }
}
