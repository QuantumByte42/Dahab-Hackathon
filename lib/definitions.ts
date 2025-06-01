import { z } from 'zod'

export const LoginFormSchema =  z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z.string()
})

export type LoginFormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string,
      redirect?: string
    }
  | undefined

export interface InvoiceItem {
  item_id: string
  item_name: string
  type: string
  weight: number
  karat: string
  selling_price: number
  making_charges: number
  quantity: number
}

