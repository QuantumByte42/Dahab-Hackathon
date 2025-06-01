'use server'

import { LoginFormSchema, LoginFormState } from '@/lib/definitions'
import { getPocketBase } from '@/lib/pocketbase'
import { cookies } from 'next/headers';

export async function login(state: LoginFormState, formData: FormData) {
  const cookieStore = await cookies();
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  console.log(`email: ${formData.get('email')}\npassword: ${formData.get('password')}`)
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }


  try {
    const pb = getPocketBase()

    // Authenticate with PocketBase
    await pb.collection("admins").authWithPassword(validatedFields.data.email, validatedFields.data.password)
    
    cookieStore.set("dahab_admin_auth", pb.authStore.exportToCookie(), {
      maxAge: 60 * 60 * 24 * 7,
      path: "/admin",
      secure: true,
      sameSite: "strict"
    })
    return {
      success: true
    }
  } catch {
    return {
      errors: {
        email: ['Invalid email or password. Please try again.'],
      },
    }
  }
}

export async function logout() {  
  try {
    (await cookies()).set("dahab_admin_auth", "", {
      "path": "/admin",
      "maxAge": 0
    })
    const pb = getPocketBase()
    pb.authStore.clear()

  } catch (error) {
    console.error("logout error:", error)
  }
}