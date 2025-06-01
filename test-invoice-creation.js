#!/usr/bin/env node

// Test script to verify invoice creation is working
import PocketBase from 'pocketbase'

const pb = new PocketBase('https://api.dahab.qb4.tech/')

async function testInvoiceCreation() {
    try {
        console.log('🔍 Testing PocketBase connection...')
        
        // Check if we can connect
        const health = await pb.health.check()
        console.log('✅ PocketBase connection successful:', health)
        
        // Get some inventory items
        console.log('\n📦 Fetching inventory...')
        const inventory = await pb.collection('inventory').getList(1, 5)
        console.log(`Found ${inventory.totalItems} inventory items`)
        
        if (inventory.items.length === 0) {
            console.log('❌ No inventory items found. Please add some inventory first.')
            return
        }
        
        console.log('Sample inventory item:', inventory.items[0])
        
        // Get or create a test customer
        console.log('\n👤 Creating/getting test customer...')
        let customer
        try {
            // Try to find existing test customer
            const existingCustomers = await pb.collection('customers').getList(1, 1, {
                filter: 'phone = "123456789"'
            })
            
            if (existingCustomers.items.length > 0) {
                customer = existingCustomers.items[0]
                console.log('Found existing test customer:', customer.name)
            } else {
                // Create new test customer
                customer = await pb.collection('customers').create({
                    name: 'Test Customer',
                    phone: '123456789',
                    email: 'test@example.com',
                    address: 'Test Address'
                })
                console.log('Created new test customer:', customer.name)
            }
        } catch (error) {
            console.error('Error with customer:', error)
            return
        }
        
        // Create a test invoice
        console.log('\n🧾 Creating test invoice...')
        const invoiceNo = `INV-TEST-${Date.now()}`
        
        const testItems = [{
            item_id: inventory.items[0].item_id,
            item_name: inventory.items[0].item_name,
            type: inventory.items[0].type,
            weight: inventory.items[0].weight,
            karat: inventory.items[0].karat,
            quantity: 1,
            selling_price: 100,
            making_charges: 20
        }]
        
        const invoiceData = {
            No: invoiceNo,
            customer: customer.id,
            type: 'cash',
            items: testItems,
            subtotal: 100,
            making_charges: 20,
            total_amount: 120
        }
        
        console.log('Invoice data to create:', invoiceData)
        
        const invoice = await pb.collection('invoices').create(invoiceData)
        console.log('✅ Invoice created successfully!')
        console.log('Invoice ID:', invoice.id)
        console.log('Invoice Number:', invoice.No)
        
        // Verify the invoice was created
        const createdInvoice = await pb.collection('invoices').getOne(invoice.id, {
            expand: 'customer'
        })
        console.log('\n✅ Verification - Invoice retrieved:')
        console.log('Customer Name:', createdInvoice.expand?.customer?.name)
        console.log('Total Amount:', createdInvoice.total_amount)
        console.log('Items Count:', Array.isArray(createdInvoice.items) ? createdInvoice.items.length : 'N/A')
        
    } catch (error) {
        console.error('❌ Error testing invoice creation:', error)
        if (error.response) {
            console.error('Response data:', error.response)
        }
    }
}

testInvoiceCreation()
