#!/usr/bin/env python3
import requests
import json
from datetime import datetime, date

# PocketBase Admin API setup
BASE_URL = "http://localhost:8090"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "admin123456"

def login_admin():
    """Login as admin and get token"""
    login_data = {
        "identity": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    
    response = requests.post(f"{BASE_URL}/api/admins/auth-with-password", json=login_data)
    if response.status_code == 200:
        return response.json()['token']
    else:
        print(f"Login failed: {response.text}")
        return None

def create_record(token, collection, data):
    """Create a record in a collection"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(f"{BASE_URL}/api/collections/{collection}/records", 
                           json=data, 
                           headers=headers)
    
    if response.status_code == 200:
        record = response.json()
        print(f"Created {collection} record: {record['id']}")
        return record
    else:
        print(f"Failed to create {collection} record: {response.text}")
        return None

def main():
    print("Adding sample data...")
    
    # Login to get admin token
    token = login_admin()
    if not token:
        print("Failed to get admin token")
        return
    print(f"Got admin token successfully")
    
    # Create sample customers
    customers = [
        {"name": "Ahmed Hassan", "email": "ahmed@example.com", "phone": "+971501234567", "address": "Dubai Marina, Dubai"},
        {"name": "Sarah Mohammed", "email": "sarah@example.com", "phone": "+971507654321", "address": "Downtown Dubai, Dubai"},
        {"name": "Omar Al-Rashid", "email": "omar@example.com", "phone": "+971509876543", "address": "Jumeirah, Dubai"}
    ]
    
    created_customers = []
    for customer_data in customers:
        customer = create_record(token, "customers", customer_data)
        if customer:
            created_customers.append(customer)
    
    # Create sample vendors
    vendors = [
        {"name": "Gold Suppliers LLC", "contact_info": "contact@goldsuppliers.ae", "address": "Gold Souk, Dubai"},
        {"name": "Precious Metals Trading", "contact_info": "+971-4-1234567", "address": "DMCC, Dubai"},
        {"name": "International Jewelry Supply", "contact_info": "info@ijsupply.com", "address": "Sharjah Industrial Area"}
    ]
    
    created_vendors = []
    for vendor_data in vendors:
        vendor = create_record(token, "vendors", vendor_data)
        if vendor:
            created_vendors.append(vendor)
    
    # Create sample inventory items
    if created_vendors:
        vendor_id = created_vendors[0]['id']
        inventory_items = [
            {
                "name": "18K Gold Necklace",
                "description": "Elegant 18K gold chain necklace",
                "quantity": 10,
                "price": 2500.00,
                "cost": 2000.00,
                "category": "Necklaces",
                "weight": 15.5,
                "purity": "18K",
                "vendor": vendor_id,
                "reorder_level": 5
            },
            {
                "name": "Diamond Ring",
                "description": "1 carat diamond engagement ring",
                "quantity": 5,
                "price": 8500.00,
                "cost": 6800.00,
                "category": "Rings",
                "weight": 4.2,
                "purity": "18K Gold with Diamond",
                "vendor": vendor_id,
                "reorder_level": 2
            },
            {
                "name": "Gold Earrings",
                "description": "22K gold traditional earrings",
                "quantity": 15,
                "price": 1200.00,
                "cost": 950.00,
                "category": "Earrings",
                "weight": 8.0,
                "purity": "22K",
                "vendor": vendor_id,
                "reorder_level": 3
            }
        ]
        
        created_inventory = []
        for item_data in inventory_items:
            item = create_record(token, "inventory", item_data)
            if item:
                created_inventory.append(item)
    
    # Create sample invoices
    if created_customers and created_inventory:
        customer_id = created_customers[0]['id']
        
        # Sample invoice items
        invoice_items = [
            {
                "inventory_id": created_inventory[0]['id'],
                "name": created_inventory[0]['name'],
                "price": created_inventory[0]['price'],
                "quantity": 2,
                "total": created_inventory[0]['price'] * 2
            },
            {
                "inventory_id": created_inventory[1]['id'],
                "name": created_inventory[1]['name'],
                "price": created_inventory[1]['price'],
                "quantity": 1,
                "total": created_inventory[1]['price'] * 1
            }
        ]
        
        subtotal = sum(item['total'] for item in invoice_items)
        tax = subtotal * 0.05  # 5% VAT
        total = subtotal + tax
        
        invoice_data = {
            "invoice_number": "INV-2025-001",
            "customer": customer_id,
            "date": datetime.now().strftime('%Y-%m-%d'),
            "items": json.dumps(invoice_items),
            "subtotal": subtotal,
            "tax": tax,
            "total": total,
            "payment_status": "pending",
            "payment_method": "Cash",
            "notes": "First sample invoice"
        }
        
        invoice = create_record(token, "invoices", invoice_data)
        
        # Create another invoice
        customer_id_2 = created_customers[1]['id']
        invoice_items_2 = [
            {
                "inventory_id": created_inventory[2]['id'],
                "name": created_inventory[2]['name'],
                "price": created_inventory[2]['price'],
                "quantity": 1,
                "total": created_inventory[2]['price'] * 1
            }
        ]
        
        subtotal_2 = sum(item['total'] for item in invoice_items_2)
        tax_2 = subtotal_2 * 0.05
        total_2 = subtotal_2 + tax_2
        
        invoice_data_2 = {
            "invoice_number": "INV-2025-002",
            "customer": customer_id_2,
            "date": datetime.now().strftime('%Y-%m-%d'),
            "items": json.dumps(invoice_items_2),
            "subtotal": subtotal_2,
            "tax": tax_2,
            "total": total_2,
            "payment_status": "paid",
            "payment_method": "Credit Card",
            "notes": "Second sample invoice"
        }
        
        invoice_2 = create_record(token, "invoices", invoice_data_2)
    
    print("Sample data creation complete!")

if __name__ == "__main__":
    main()
