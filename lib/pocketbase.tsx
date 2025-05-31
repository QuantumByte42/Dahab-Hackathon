import PocketBase from "pocketbase"

// Create a single PocketBase instance for the entire app
let pb: PocketBase

// Initialize PocketBase
export function initPocketBase() {
  // const cookiesStore = await cookies()
  if (!pb) {
    // Make sure we have a valid URL with protocol
    const url = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090"

    // Ensure the URL has a protocol
    const finalUrl = url.startsWith("http") ? url : `http://${url}`

    pb = new PocketBase(finalUrl).autoCancellation(false)
  }
  return pb
}

// Get the PocketBase instance
export function getPocketBase() {
  if (!pb) {
    return initPocketBase()
  }
  return pb
}