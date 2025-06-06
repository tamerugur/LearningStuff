import { useEffect, useMemo, useState } from "react";
import { useWatch, UseFormRegister, Control } from "react-hook-form";
import { Checklist } from "@/components/Checklist";
import { RegisterData } from "@shared/schemas/userSchema";

type ChecklistItem = {
  label: string;
  passed: boolean;
};

type Props = {
  name: keyof RegisterData;
  label: string;
  type?: string;
  checklistFn: (value: string) => ChecklistItem[];
  register: UseFormRegister<RegisterData>;
  control: Control<RegisterData>;
};

export function ChecklistField({
  name,
  label,
  type = "text",
  checklistFn,
  register,
  control,
}: Props) {
  const value = useWatch({ control, name }) || "";
  const checklist = useMemo(() => checklistFn(value), [value, checklistFn]);

  const shouldShowChecklist = !!value && checklist.some((item) => !item.passed);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(shouldShowChecklist), 300);
    return () => clearTimeout(timeout);
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
