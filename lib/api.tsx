import { CustomerRecord } from "./definitions";
import { getPocketBase } from "./pocketbase";

export async function get_customers() {
    const pb = getPocketBase()

    const customers = await pb.collection("customers")
                            .getList<CustomerRecord>(1, 50);
    if (customers.totalItems > 0)
        return (customers.items)
    return ([])
}