import React, { useRef } from "react";
import { CheckCircle, XCircle } from "lucide-react";

type ChecklistItem = {
  label: string;
  passed: boolean;
};

type ChecklistProps = {
  items: ChecklistItem[];
  visible: boolean;
};

export function Checklist({ items, visible }: ChecklistProps) {
  const listRef = useRef<HTMLUListElement>(null);

  return (
    <ul
      ref={listRef}
      className={`mt-2 space-y-1 text-sm overflow-hidden transition-all duration-300 ease-in-out ${
        visible ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 font-medium">
          {item.passed ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
