import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterData } from '@shared/schemas/user'
import { useEffect, useMemo, useState } from 'react'
import { Checklist } from '@/components/Checklist'

export function UserRegister() {
  const { register, handleSubmit, watch } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    criteriaMode: 'all',
  })

  const rawEmail = watch('email') || ''
  const rawFullName = watch('fullName') || ''
  const rawPassword = watch('password') || ''
  const rawId = watch('id') || ''

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [id, setId] = useState('')

  const [showEmailChecklist, setShowEmailChecklist] = useState(false)
  const [showNameChecklist, setShowNameChecklist] = useState(false)
  const [showPasswordChecklist, setShowPasswordChecklist] = useState(false)
  const [showIdChecklist, setShowIdChecklist] = useState(false)

  const [hideEmailChecklist, setHideEmailChecklist] = useState(false)
  const [hideNameChecklist, setHideNameChecklist] = useState(false)
  const [hidePasswordChecklist, setHidePasswordChecklist] = useState(false)
  const [hideIdChecklist, setHideIdChecklist] = useState(false)

  const emailChecklist = useMemo(() => [
    { label: 'Invalid email format', passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) },
  ], [email])

  const fullNameChecklist = useMemo(() => [
    { label: 'Please enter your full name', passed: fullName.trim().split(/\s+/).length >= 2 },
  ], [fullName])

  const passwordChecklist = useMemo(() => [
    { label: 'At least 6 characters', passed: password.length >= 6 },
    { label: 'Contains an uppercase letter', passed: /[A-Z]/.test(password) },
    { label: 'Contains a special character', passed: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { label: 'Contains a digit', passed: /\d/.test(password) },
    { label: 'Passwords match', passed: watch('repeatPassword') === password && password.length > 0 },
  ], [password, watch])

  const idChecklist = useMemo(() => {
    const digits = id.split('').map(Number)
    const lengthValid = /^\d{11}$/.test(id) && id[0] !== '0'
    const tenthDigitValid =
      digits.length === 11
        ? ((digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 -
            (digits[1] + digits[3] + digits[5] + digits[7])) % 10 === digits[9]
        : false
    const eleventhDigitValid =
      digits.length === 11
        ? digits.slice(0, 10).reduce((sum, d) => sum + d, 0) % 10 === digits[10]
        : false

    const valid = lengthValid && tenthDigitValid && eleventhDigitValid
    return [{ label: 'Invalid ID format', passed: valid }]
  }, [id])

  const allEmailPassed = emailChecklist.every(item => item.passed)
  const allNamePassed = fullNameChecklist.every(item => item.passed)
  const allPasswordPassed = passwordChecklist.every(item => item.passed)
  const allIdPassed = idChecklist.every(item => item.passed)

  useEffect(() => {
    const t = setTimeout(() => { setEmail(rawEmail); setShowEmailChecklist(!!rawEmail) }, 500)
    return () => clearTimeout(t)
  }, [rawEmail])

  useEffect(() => {
    const t = setTimeout(() => { setFullName(rawFullName); setShowNameChecklist(!!rawFullName) }, 500)
    return () => clearTimeout(t)
  }, [rawFullName])

  useEffect(() => {
    const t = setTimeout(() => { setPassword(rawPassword); setShowPasswordChecklist(!!rawPassword) }, 500)
    return () => clearTimeout(t)
  }, [rawPassword])

  useEffect(() => {
    const t = setTimeout(() => { setId(rawId); setShowIdChecklist(!!rawId) }, 500)
    return () => clearTimeout(t)
  }, [rawId])

  useEffect(() => {
    if (allEmailPassed) {
      const t = setTimeout(() => setShowEmailChecklist(false), 800)
      setHideEmailChecklist(true)
      return () => clearTimeout(t)
    } else setHideEmailChecklist(false)
  }, [allEmailPassed])

  useEffect(() => {
    if (allNamePassed) {
      const t = setTimeout(() => setShowNameChecklist(false), 800)
      setHideNameChecklist(true)
      return () => clearTimeout(t)
    } else setHideNameChecklist(false)
  }, [allNamePassed])

  useEffect(() => {
    if (allPasswordPassed) {
      const t = setTimeout(() => setShowPasswordChecklist(false), 800)
      setHidePasswordChecklist(true)
      return () => clearTimeout(t)
    } else setHidePasswordChecklist(false)
  }, [allPasswordPassed])

  useEffect(() => {
    if (allIdPassed) {
      const t = setTimeout(() => setShowIdChecklist(false), 800)
      setHideIdChecklist(true)
      return () => clearTimeout(t)
    } else setHideIdChecklist(false)
  }, [allIdPassed])

  const onSubmit = (data: RegisterData) => {
    console.log('✅ Registered:', data)
  }

  const onInvalid = (errors: Partial<Record<keyof RegisterData, unknown>>) => {
    if (errors.email) setShowEmailChecklist(true)
    if (errors.fullName) setShowNameChecklist(true)
    if (errors.password) setShowPasswordChecklist(true)
    if (errors.id) setShowIdChecklist(true)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="max-w-sm w-full mx-auto flex flex-col gap-4 text-left">
      {/* Email */}
      <div>
        <label className="block mb-1 font-medium text-sm">Email:</label>
        <input {...register('email')} type="text" autoComplete="off"
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" />
        <Checklist items={emailChecklist} visible={showEmailChecklist} hide={hideEmailChecklist} />
      </div>

      {/* ID */}
      <div>
        <label className="block mb-1 font-medium text-sm">ID (T.C.):</label>
        <input {...register('id')} type="text" autoComplete="off"
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" />
        <Checklist items={idChecklist} visible={showIdChecklist} hide={hideIdChecklist} />
      </div>

      {/* Full Name */}
      <div>
        <label className="block mb-1 font-medium text-sm">Full Name:</label>
        <input {...register('fullName')} type="text" autoComplete="off"
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" />
        <Checklist items={fullNameChecklist} visible={showNameChecklist} hide={hideNameChecklist} />
      </div>

      {/* Password */}
      <div>
        <label className="block mb-1 font-medium text-sm">Password:</label>
        <input {...register('password')} type="password"
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" />
      </div>

      {/* Repeat Password */}
      <div>
        <label className="block mb-1 font-medium text-sm">Repeat Password:</label>
        <input {...register('repeatPassword')} type="password"
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" />
      </div>

      <Checklist items={passwordChecklist} visible={showPasswordChecklist} hide={hidePasswordChecklist} />

      <button type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        Register
      </button>
    </form>
  )
}
