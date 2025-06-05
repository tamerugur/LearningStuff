import React from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

type ChecklistItem = {
  label: string
  passed: boolean
}

type ChecklistProps = {
  items: ChecklistItem[]
  visible: boolean
  hide?: boolean
}

export function Checklist({ items, visible, hide = false }: ChecklistProps) {
  if (!visible) return null

  return (
    <ul className={`mt-2 space-y-1 text-sm transition-opacity duration-800 ${hide ? 'opacity-0' : 'opacity-100'}`}>
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-center gap-2 font-medium transition-colors duration-300"
        >
          {item.passed ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
