import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterData } from '@shared/schemas/user'
import { useEffect, useMemo, useState } from 'react'

export function UserRegister() {
  const {
    register,
    handleSubmit,
    watch,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    criteriaMode: 'all',
  })

  const rawEmail = watch('email') || ''
  const rawFullName = watch('fullName') || ''
  const rawPassword = watch('password') || ''

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')

  const [showEmailChecklist, setShowEmailChecklist] = useState(false)
  const [showNameChecklist, setShowNameChecklist] = useState(false)
  const [showPasswordChecklist, setShowPasswordChecklist] = useState(false)

  const [hideEmailChecklist, setHideEmailChecklist] = useState(false)
  const [hideNameChecklist, setHideNameChecklist] = useState(false)
  const [hidePasswordChecklist, setHidePasswordChecklist] = useState(false)

  // Validation logic
  const emailChecklist = useMemo(() => [
    {
      label: 'Valid email format',
      passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    },
  ], [email])

  const fullNameChecklist = useMemo(() => [
    {
      label: 'Includes at least two words',
      passed: fullName.trim().split(/\s+/).length >= 2,
    },
  ], [fullName])

  const passwordChecklist = useMemo(() => [
    {
      label: 'At least 6 characters',
      passed: password.length >= 6,
    },
    {
      label: 'Contains an uppercase letter',
      passed: /[A-Z]/.test(password),
    },
    {
      label: 'Contains a special character',
      passed: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    {
      label: 'Contains a digit',
      passed: /\d/.test(password),
    },
    {
      label: 'Passwords match',
      passed: watch('repeatPassword') === password && password.length > 0,
    }
  ], [password, watch])

  const allEmailPassed = emailChecklist.every(item => item.passed)
  const allNamePassed = fullNameChecklist.every(item => item.passed)
  const allPasswordPassed = passwordChecklist.every(item => item.passed)

  // Show checklists after typing delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      setEmail(rawEmail)
      setShowEmailChecklist(!!rawEmail)
    }, 500)
    return () => clearTimeout(timeout)
  }, [rawEmail])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFullName(rawFullName)
      setShowNameChecklist(!!rawFullName)
    }, 500)
    return () => clearTimeout(timeout)
  }, [rawFullName])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPassword(rawPassword)
      setShowPasswordChecklist(!!rawPassword)
    }, 500)
    return () => clearTimeout(timeout)
  }, [rawPassword])

  // Hide checklists when satisfied
  useEffect(() => {
    if (allEmailPassed) {
      const timeout = setTimeout(() => setShowEmailChecklist(false), 800)
      setHideEmailChecklist(true)
      return () => clearTimeout(timeout)
    } else {
      setHideEmailChecklist(false)
    }
  }, [allEmailPassed])

  useEffect(() => {
    if (allNamePassed) {
      const timeout = setTimeout(() => setShowNameChecklist(false), 800)
      setHideNameChecklist(true)
      return () => clearTimeout(timeout)
    } else {
      setHideNameChecklist(false)
    }
  }, [allNamePassed])

  useEffect(() => {
    if (allPasswordPassed) {
      const timeout = setTimeout(() => setShowPasswordChecklist(false), 800)
      setHidePasswordChecklist(true)
      return () => clearTimeout(timeout)
    } else {
      setHidePasswordChecklist(false)
    }
  }, [allPasswordPassed])

  // Handlers
  const onSubmit = (data: RegisterData) => {
    console.log('✅ Registered:', data)
  }

  const onInvalid = (errors: Partial<Record<keyof RegisterData, unknown>>) => {
    if (errors.email) setShowEmailChecklist(true)
    if (errors.fullName) setShowNameChecklist(true)
    if (errors.password) setShowPasswordChecklist(true)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="max-w-sm w-full mx-auto flex flex-col gap-4 text-left"
    >
      {/* Full Name */}
      <div>
        <label className="block mb-1 font-medium text-sm">Full Name:</label>
        <input
          {...register('fullName')}
          type="text"
          autoComplete='off'
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        />
        {showNameChecklist && (
          <ul className={`mt-2 space-y-1 text-sm transition-opacity duration-800 ${hideNameChecklist ? 'opacity-0' : 'opacity-100'}`}>
            {fullNameChecklist.map((item, i) => (
              <li
                key={i}
                className={`transition-colors duration-300 font-medium ${item.passed ? 'text-green-600' : 'text-red-500'}`}
              >
                {item.passed ? '✓' : '✗'} {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block mb-1 font-medium text-sm">Email:</label>
        <input
          {...register('email')}
          type="text"
          autoComplete='off'
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        />
        {showEmailChecklist && (
          <ul className={`mt-2 space-y-1 text-sm transition-opacity duration-800 ${hideEmailChecklist ? 'opacity-0' : 'opacity-100'}`}>
            {emailChecklist.map((item, i) => (
              <li
                key={i}
                className={`transition-colors duration-300 font-medium ${item.passed ? 'text-green-600' : 'text-red-500'}`}
              >
                {item.passed ? '✓' : '✗'} {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block mb-1 font-medium text-sm">Password:</label>
        <input
          {...register('password')}
          type="password"
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        />
      </div>

      {/* Repeat Password */}
      <div>
        <label className="block mb-1 font-medium text-sm">Repeat Password:</label>
        <input
          {...register('repeatPassword')}
          type="password"
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        />
      </div>
        {showPasswordChecklist && (
          <ul className={`mt-2 space-y-1 transition-opacity duration-800 ${hidePasswordChecklist ? 'opacity-0' : 'opacity-100'}`}>
            {passwordChecklist.map((item, i) => (
              <li
                key={i}
                className={`text-sm font-medium transition-colors duration-300 ${item.passed ? 'text-green-600' : 'text-red-500'}`}
              >
                {item.passed ? '✓' : '✗'} {item.label}
              </li>
            ))}
          </ul>
        )}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Register
      </button>
    </form>
  )
}
