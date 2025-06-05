import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterData } from '@shared/schemas/userSchema'
import { ChecklistField } from './ChecklistField'

export function UserRegister() {
  console.log('🔄 UserRegister component rendered')
  const { register, handleSubmit, control } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    criteriaMode: 'all',
  })

  const onSubmit = (data: RegisterData) => console.log('✅ Registered:', data)

  const emailChecklist = (email: string) => [
    { label: 'Invalid email format', passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) },
  ]

  const fullNameChecklist = (name: string) => [
    { label: 'Please enter your full name', passed: name.trim().split(/\s+/).length >= 2 },
  ]

  const passwordChecklist = (pw: string) => [
    { label: 'At least 6 characters', passed: pw.length >= 6 },
    { label: 'Contains uppercase', passed: /[A-Z]/.test(pw) },
    { label: 'Special character', passed: /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
    { label: 'Contains digit', passed: /\d/.test(pw) },
  ]

  const idChecklist = (id: string) => {
    const digits = id.split('').map(Number)
    const lengthValid = /^\d{11}$/.test(id) && id[0] !== '0'
    const tenthValid =
      digits.length === 11
        ? ((digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 -
            (digits[1] + digits[3] + digits[5] + digits[7])) % 10 === digits[9]
        : false
    const eleventhValid =
      digits.length === 11
        ? digits.slice(0, 10).reduce((sum, d) => sum + d, 0) % 10 === digits[10]
        : false
    return [{ label: 'Invalid ID format', passed: lengthValid && tenthValid && eleventhValid }]
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl w-full mx-auto flex flex-col gap-6 text-left">
      <div className="flex gap-4">
        <ChecklistField name="email" label="Email" register={register} control={control} checklistFn={emailChecklist} />
        <ChecklistField name="tcId" label="ID (T.C.)" register={register} control={control} checklistFn={idChecklist} />
      </div>

      <div className="flex gap-4">
        <ChecklistField name="fullName" label="Full Name" register={register} control={control} checklistFn={fullNameChecklist} />
        <div className="flex-1">
          <label className="block mb-1 font-medium text-sm">Username:</label>
          <input {...register('username')} type="text" autoComplete="off"
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" />
        </div>
      </div>

      <div className="flex gap-4">
        <ChecklistField name="password" label="Password" register={register} control={control} checklistFn={passwordChecklist} type="password" />
        <div className="flex-1">
          <label className="block mb-1 font-medium text-sm">Repeat Password:</label>
          <input {...register('repeatPassword')} type="password"
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" />
        </div>
      </div>

      <button type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        Register
      </button>
    </form>
  )
}
