"use server"

import { getPocketBase } from "./pocketbase";

export async function submitForm<T>(
  recordId: string | null,
  collection: string,
  form: FormData | {[key: string]: any | T},
) : Promise<{record:Awaited<T> | null, msg: string }> {
  console.log(form)
  try {
    const pb = getPocketBase()
    let new_record;
    if (recordId) {
      new_record = await pb.collection(collection).update<T>(recordId, form)
    } else {
      new_record = await pb.collection(collection).create<T>(form)
    }
    return {
      record: new_record, 
      msg: "successfully update page content"
    }
  } catch (error) {
    return {
      record: null,
      msg: error instanceof Error ? error.message : "An unexpected error occurred. Please try again later."
    }
  }
}