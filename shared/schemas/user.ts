import { z } from 'zod'

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .refine((val) => val.trim().split(/\s+/).length >= 2, {
        message: 'Please enter both name and surname',
      }),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
      .regex(/\d/, 'Password must contain at least one digit'),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ['repeatPassword'],
  })

export type RegisterData = z.infer<typeof registerSchema>
