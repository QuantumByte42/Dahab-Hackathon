import { getPocketBase } from "./pocketbase";
import { CustomersRecord, InventoryRecord } from "./pocketbase-types";

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
        const item = await pb.collection("inventory")
                .getFirstListItem<InventoryRecord>(`item_id = '${itemId}'`)
        return (item)
    } catch {
        return (null)
    }
     
}
