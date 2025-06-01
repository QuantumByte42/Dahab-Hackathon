// Test script to verify PocketBase connection
import { getPocketBase } from './lib/pocketbase'
import { get_customers, get_inventory, get_vendors } from './lib/api'

async function testPocketBaseConnection() {
  console.log('Testing PocketBase connection...')
  
  try {
    const pb = getPocketBase()
    console.log('PocketBase instance created:', pb.baseUrl)
    
    // Test getting collections info
    console.log('\n--- Testing Collections ---')
    
    // Test customers
    console.log('Testing customers...')
    const customers = await get_customers()
    console.log(`Found ${customers.length} customers`)
    
    // Test inventory
    console.log('Testing inventory...')
    const inventory = await get_inventory()
    console.log(`Found ${inventory.length} inventory items`)
    
    // Test vendors
    console.log('Testing vendors...')
    const vendors = await get_vendors()
    console.log(`Found ${vendors.length} vendors`)
    
    console.log('\n✅ All tests passed! PocketBase connection is working.')
    
  } catch (error) {
    console.error('❌ Error testing PocketBase connection:', error)
  }
}

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
  testPocketBaseConnection()
}

export { testPocketBaseConnection }
