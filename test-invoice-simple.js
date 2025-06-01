// Test script to verify invoice creation is working
const PocketBase = require('pocketbase')

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
        
        // Create a test invoice
        console.log('\n🧾 Creating test invoice...')
        const invoiceNo = `INV-TEST-${Date.now()}`
        
        // First get or create a customer
        let customer
        try {
            customer = await pb.collection('customers').create({
                name: 'Test Customer ' + Date.now(),
                phone: '123456789' + Date.now(),
                email: 'test' + Date.now() + '@example.com',
                address: 'Test Address'
            })
            console.log('Created test customer:', customer.name)
        } catch (error) {
            console.error('Error creating customer:', error)
            return
        }
        
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
        
    } catch (error) {
        console.error('❌ Error testing invoice creation:', error)
        if (error.response) {
            console.error('Response data:', error.response)
        }
    }
}

testInvoiceCreation()
