import requests
import json

# Login to get auth token
auth_response = requests.post('http://localhost:8090/api/admins/auth-with-password', {
    'identity': 'admin@example.com',
    'password': 'admin123456'
})

if auth_response.status_code == 200:
    token = auth_response.json()['token']
    headers = {'Authorization': f'Bearer {token}'}
    
    # Get current collection schema
    schema_response = requests.get('http://localhost:8090/api/collections/inventory', headers=headers)
    if schema_response.status_code == 200:
        collection = schema_response.json()
        current_schema = collection.get('schema', [])
        
        # Check if item_id field already exists
        item_id_exists = any(field.get('name') == 'item_id' for field in current_schema)
        
        if not item_id_exists:
            # Add item_id field to schema
            new_field = {
                "name": "item_id",
                "type": "text",
                "system": False,
                "required": False,
                "presentable": False,
                "unique": True,
                "options": {
                    "min": None,
                    "max": None,
                    "pattern": ""
                }
            }
            
            current_schema.append(new_field)
            
            # Update collection schema
            update_data = {
                "name": collection['name'],
                "type": collection['type'],
                "schema": current_schema,
                "indexes": collection.get('indexes', []),
                "listRule": collection.get('listRule'),
                "viewRule": collection.get('viewRule'),
                "createRule": collection.get('createRule'),
                "updateRule": collection.get('updateRule'),
                "deleteRule": collection.get('deleteRule'),
                "options": collection.get('options', {})
            }
            
            update_response = requests.patch(
                f'http://localhost:8090/api/collections/{collection["id"]}',
                headers=headers,
                json=update_data
            )
            
            if update_response.status_code == 200:
                print("Successfully added item_id field to inventory collection")
            else:
                print(f"Failed to update collection schema: {update_response.text}")
        else:
            print("item_id field already exists in collection schema")
    else:
        print('Failed to fetch collection schema')
else:
    print('Failed to authenticate')
