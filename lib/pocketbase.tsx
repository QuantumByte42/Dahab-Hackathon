import PocketBase from "pocketbase"

// Create a single PocketBase instance for the entire app
let pb: PocketBase

// Initialize PocketBase
export function initPocketBase() {
  // const cookiesStore = await cookies()
  if (!pb) {
    // Get URL from environment variables, prioritizing NEXT_POCKETBASE for server-side
    const url = 
      process.env.NEXT_POCKETBASE || 
      process.env.NEXT_PUBLIC_POCKETBASE_URL || 
      "https://api.dahab.qb4.tech"

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