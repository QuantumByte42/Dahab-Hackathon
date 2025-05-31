import PocketBase from "pocketbase"

// Create a single PocketBase instance for the entire app
let pb: PocketBase

// Initialize PocketBase
export function initPocketBase() {
  if (!pb) {
    // Get URL from environment variables, prioritizing NEXT_POCKETBASE for server-side
    const url = 
      process.env.NEXT_POCKETBASE || 
      process.env.NEXT_PUBLIC_POCKETBASE_URL || 
      "https://api.dahab.qb4.tech"

    // Ensure the URL has a protocol
    const finalUrl = url.startsWith("http") ? url : `https://${url}`

    pb = new PocketBase(finalUrl).autoCancellation(false)
    
    // Log connection for debugging
    console.log("PocketBase initialized with URL:", finalUrl)
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