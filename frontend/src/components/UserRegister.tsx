import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerSchema, RegisterData } from "../schemas/userSchema";
import { ChecklistField } from "./ChecklistField";
import { registerUser } from "../lib/api";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { Mail, User, IdCard, Lock, KeyRound, AtSign } from "lucide-react";
import FloatingInput from "./FloatingInput";

type ChecklistItem = {
  label: string;
  passed: boolean;
};

export function UserRegister() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterData>,
    criteriaMode: "all",
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });

  const handleSubmitForm = useCallback(
    (data: RegisterData) => {
      mutation.mutate(data);
    },
    [mutation]
  );

  const emailChecklist = useCallback(
    (email: string): ChecklistItem[] => [
      {
        label: "Valid email format",
        passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      },
    ],
    []
  );

  const fullNameChecklist = useCallback(
    (name: string): ChecklistItem[] => [
      {
        label: "Full name with at least two words",
        passed: name.trim().split(/\s+/).length >= 2,
      },
    ],
    []
  );

  const usernameChecklist = useCallback(
    (username: string): ChecklistItem[] => [
      {
        label: "3–16 characters",
        passed: username.length >= 3 && username.length <= 16,
      },
      {
        label: "Only letters, numbers, underscores",
        passed: /^[a-zA-Z0-9_]+$/.test(username),
      },
    ],
    []
  );

  const passwordChecklist = useCallback(
    (pw: string, repeatPw?: string): ChecklistItem[] => [
      { label: "At least 6 characters", passed: pw.length >= 6 },
      { label: "Uppercase letter", passed: /[A-Z]/.test(pw) },
      {
        label: "Special character",
        passed: /[!@#$%^&*(),.?":{}|<>]/.test(pw),
      },
      { label: "Contains digit", passed: /\d/.test(pw) },
      {
        label: "Passwords match",
        passed: !!repeatPw && pw === repeatPw,
      },
    ],
    []
  );

  const idChecklist = useCallback((id: string): ChecklistItem[] => {
    const digits = id.split("").map(Number);
    const lengthValid = /^\d{11}$/.test(id) && id[0] !== "0";
    const tenthValid =
      digits.length === 11
        ? ((digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 -
            (digits[1] + digits[3] + digits[5] + digits[7])) %
            10 ===
          digits[9]
        : false;
    const eleventhValid =
      digits.length === 11
        ? digits.slice(0, 10).reduce((sum, d) => sum + d, 0) % 10 === digits[10]
        : false;

    return [
      {
        label: "Valid 11-digit Turkish ID",
        passed: lengthValid && tenthValid && eleventhValid,
      },
    ];
  }, []);

  return (
    <div className="relative flex justify-center mt-6 mb-3">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="flex flex-col gap-6 text-left"
        noValidate
      >
        <div className="flex gap-x-4 gap-y-4 justify-center mx-auto w-full">
          <ChecklistField
            name="email"
            label="Email"
            register={register}
            control={control}
            errors={errors}
            checklistFn={emailChecklist}
            required={true}
            leftIcon={<Mail className="w-4 h-4" />}
          />
          <ChecklistField
            name="tcId"
            label="ID (T.C.)"
            register={register}
            control={control}
            errors={errors}
            checklistFn={idChecklist}
            leftIcon={<IdCard className="w-4 h-4" />}
          />
        </div>

        <div className="flex gap-x-4 gap-y-4 justify-center mx-auto w-full">
          <ChecklistField
            name="fullName"
            label="Full Name"
            register={register}
            control={control}
            errors={errors}
            checklistFn={fullNameChecklist}
            required={true}
            leftIcon={<User className="w-4 h-4" />}
          />
          <ChecklistField
            name="username"
            label="Username"
            register={register}
            control={control}
            errors={errors}
            checklistFn={usernameChecklist}
            required={true}
            leftIcon={<AtSign className="w-4 h-4" />}
          />
        </div>

        <div className="flex gap-x-4 gap-y-4 justify-center mx-auto w-full">
          <ChecklistField
            name="password"
            label="Password"
            register={register}
            control={control}
            errors={errors}
            checklistFn={passwordChecklist}
            type="password"
            compareField="repeatPassword"
            required={true}
            leftIcon={<Lock className="w-4 h-4" />}
          />
          <div className="flex-1 w-full max-w-[44%]">
            <FloatingInput
              id="repeatPassword"
              label="Repeat Password"
              type="password"
              required={true}
              error={errors.repeatPassword?.message}
              {...register("repeatPassword")}
              leftIcon={<KeyRound className="w-4 h-4" />}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending}
          variant="default"
          className={`self-center px-8 py-4 bg-background hover:bg-button-hover ${
            mutation.isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {mutation.isPending ? "Registering..." : "Register"}
        </Button>

        {mutation.isSuccess && (
          <p className="text-green-600 text-center mt-2">
            Registration successful!
          </p>
        )}
        {mutation.isError && (
          <p className="text-red-600 text-center mt-2">
            {mutation.error?.message || "Registration failed"}
          </p>
        )}
      </form>
    </div>
  );
}
