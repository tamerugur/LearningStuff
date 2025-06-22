import { useEffect, useMemo, useState, useCallback } from "react";
import {
  useWatch,
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form";
import { Checklist } from "@/components/Checklist";
import { RegisterData } from "../schemas/userSchema";
import { useDebounceValue } from "../hooks/useDebounceValue";
import FloatingInput from "./FloatingInput";
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
  errors: FieldErrors<RegisterData>;
  compareField?: keyof RegisterData;
  required?: boolean;
  leftIcon?: React.ReactNode;
};

export function ChecklistField({
  name,
  label,
  type = "text",
  checklistFn,
  register,
  control,
  errors,
  compareField,
  required = false,
  leftIcon,
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

  const handleVisibilityChange = useCallback(() => {
    if (shouldShowChecklist) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [shouldShowChecklist]);

  useEffect(() => {
    handleVisibilityChange();
  }, [handleVisibilityChange]);

  return (
    <div className="w-full max-w-[44%]">
      <FloatingInput
        id={name}
        label={label}
        type={type}
        required={required}
        error={errors[name]?.message as string}
        leftIcon={leftIcon}
        {...register(name)}
      />
      <Checklist items={checklist} visible={visible} />
    </div>
  );
}
