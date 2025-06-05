import { useEffect, useMemo, useState, memo } from 'react'
import { useWatch, UseFormRegister, Control } from 'react-hook-form'
import { Checklist } from '@/components/Checklist'
import { RegisterData } from '@shared/schemas/userSchema'

type ChecklistItem = { label: string; passed: boolean }

type Props = {
  name: keyof RegisterData
  label: string
  type?: string
  checklistFn: (value: string) => ChecklistItem[]
  register: UseFormRegister<RegisterData>
  control: Control<RegisterData>
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

const ChecklistWatcher = memo(function ChecklistWatcher({
  name,
  control,
  checklistFn,
}: {
  name: keyof RegisterData
  control: Control<RegisterData>
  checklistFn: (value: string) => ChecklistItem[]
}) {
  const rawValue = useWatch({ control, name }) || ''
  const value = useDebounce(rawValue, 300)
  const checklist = useMemo(() => checklistFn(value), [checklistFn, value])

  const [show, setShow] = useState(false)
  const [hide, setHide] = useState(false)

  useEffect(() => {
    const allPassed = checklist.every(i => i.passed)
    const shouldShow = !!value && !allPassed
    setShow(prev => (prev !== shouldShow ? shouldShow : prev))
  }, [value, checklist])

  useEffect(() => {
    const passed = checklist.every(i => i.passed)
    setHide(prev => (prev !== passed ? passed : prev))
    if (passed) setShow(prev => (prev !== false ? false : prev))
  }, [checklist])

  return <Checklist items={checklist} visible={show} hide={hide} />
})

export const ChecklistField = memo(function ChecklistField({
  name,
  label,
  type = 'text',
  checklistFn,
  register,
  control,
}: Props) {
  console.log(`🔄 ChecklistField rendered for ${name}`)

  return (
    <div className="flex-1">
      <label className="block mb-1 font-medium text-sm">{label}:</label>
      <input
        {...register(name)}
        type={type}
        autoComplete="off"
        className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
      />
      <ChecklistWatcher name={name} control={control} checklistFn={checklistFn} />
    </div>
  )
})
