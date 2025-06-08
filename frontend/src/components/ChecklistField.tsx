import { useEffect, useMemo, useState } from "react";
import { useWatch, UseFormRegister, Control } from "react-hook-form";
import { Checklist } from "@/components/Checklist";
import { RegisterData } from "../schemas/userSchema";
import { useDebounceValue } from "../hooks/useDebounceValue";

type ChecklistItem = {
  label: string;
  passed: boolean;
};

type Props = {
  name: keyof RegisterData;
  label: string;
  type?: string;
  checklistFn: (value: string, compareValue?: string) => ChecklistItem[];
  register: UseFormRegister<RegisterData>;
  control: Control<RegisterData>;
  compareField?: keyof RegisterData;
};

export function ChecklistField({
  name,
  label,
  type = "text",
  checklistFn,
  register,
  control,
  compareField,
}: Props) {
  const value = useWatch({ control, name }) || "";
  const compareFieldValue =
    useWatch({
      control,
      name: compareField || name,
    }) || "";

  const debouncedValue = useDebounceValue(value, 300);
  const debouncedCompareValue = useDebounceValue(compareFieldValue, 300);

  const checklist = useMemo(
    () =>
      checklistFn(
        debouncedValue,
        compareField ? debouncedCompareValue : undefined
      ),
    [debouncedValue, debouncedCompareValue, compareField, checklistFn]
  );

  const shouldShowChecklist =
    !!debouncedValue && checklist.some((item) => !item.passed);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (shouldShowChecklist) {
      // Show immediately when needed
      setVisible(true);
    } else {
      // Add a small delay before hiding to ensure smooth transition
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [shouldShowChecklist]);

  return (
    <div className="flex-1">
      <label className="block mb-1 font-medium text-sm">{label}:</label>
      <input
        {...register(name)}
        type={type}
        autoComplete="off"
        className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
      />
      <Checklist items={checklist} visible={visible} />
    </div>
  );
}
