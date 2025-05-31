#!/usr/bin/env python3
import requests
import json

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

def get_collections(token):
    """Get existing collections to find their IDs"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(f"{BASE_URL}/api/collections", headers=headers)
    
    if response.status_code == 200:
        collections = {}
        for collection in response.json()['items']:
            collections[collection['name']] = collection['id']
        return collections
    else:
        print(f"Failed to get collections: {response.text}")
        return {}
    """Create a collection using the admin API"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(f"{BASE_URL}/api/collections", 
                           json=collection_data, 
                           headers=headers)
    
    if response.status_code == 200:
        print(f"Successfully created collection: {collection_data['name']}")
        return True
    else:
        print(f"Failed to create collection {collection_data['name']}: {response.text}")
        return False

def main():
    print("Starting collection setup...")
    # Login to get admin token
    token = login_admin()
    if not token:
        print("Failed to get admin token")
        return
    print(f"Got admin token: {token[:20]}...")
    
    # Define collections
    collections = [
        {
            "name": "customers",
            "type": "base",
            "schema": [
                {"name": "name", "type": "text", "required": True},
                {"name": "address", "type": "text"},
                {"name": "phone", "type": "text"},
                {"name": "email", "type": "email"}
            ]
        },
        {
            "name": "vendors",
            "type": "base", 
            "schema": [
                {"name": "name", "type": "text", "required": True},
                {"name": "contact_info", "type": "text"},
                {"name": "address", "type": "text"}
            ]
        },
        {
            "name": "inventory",
            "type": "base",
            "schema": [
                {"name": "name", "type": "text", "required": True},
                {"name": "description", "type": "text"},
                {"name": "quantity", "type": "number", "required": True},
                {"name": "price", "type": "number", "required": True},
                {"name": "cost", "type": "number"},
                {"name": "category", "type": "text"},
                {"name": "weight", "type": "number"},
                {"name": "purity", "type": "text"},
                {"name": "vendor", "type": "relation", "options": {"collectionId": "", "cascadeDelete": False}},
                {"name": "reorder_level", "type": "number"}
            ]
        },
        {
            "name": "invoices",
            "type": "base",
            "schema": [
                {"name": "invoice_number", "type": "text", "required": True},
                {"name": "customer", "type": "relation", "options": {"collectionId": "", "cascadeDelete": False}},
                {"name": "date", "type": "date", "required": True},
                {"name": "items", "type": "json", "required": True},
                {"name": "subtotal", "type": "number", "required": True},
                {"name": "tax", "type": "number"},
                {"name": "total", "type": "number", "required": True},
                {"name": "payment_status", "type": "select", "options": {"values": ["pending", "paid", "partially_paid", "overdue"]}},
                {"name": "payment_method", "type": "text"},
                {"name": "notes", "type": "text"}
            ]
        }
    ]
    
    # Create each collection
    for collection in collections:
        create_collection(token, collection)

if __name__ == "__main__":
    main()
