import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerSchema, RegisterData } from "../schemas/userSchema";
import { ChecklistField } from "./ChecklistField";
import { registerUser } from "../lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UserRegister() {
  const { register, handleSubmit, control } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterData>,
    criteriaMode: "all",
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });

  const onSubmit = (data: RegisterData) => {
    mutation.mutate(data);
  };

  const emailChecklist = (email: string) => [
    {
      label: "Valid email format",
      passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    },
  ];

  const fullNameChecklist = (name: string) => [
    {
      label: "Full name with at least two words",
      passed: name.trim().split(/\s+/).length >= 2,
    },
  ];

  const usernameChecklist = (username: string) => [
    {
      label: "3–16 characters",
      passed: username.length >= 3 && username.length <= 16,
    },
    {
      label: "Only letters, numbers, underscores",
      passed: /^[a-zA-Z0-9_]+$/.test(username),
    },
  ];

  const passwordChecklist = (pw: string, repeatPw?: string) => [
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
  ];

  const idChecklist = (id: string) => {
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
  };

  return (
    <div className="relative flex justify-center mt-3 mb-3">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl w-full flex flex-col gap-6 text-left"
      >
        <div className="flex gap-y-4 justify-center mx-auto w-full max-w-2xl">
          <ChecklistField
            name="email"
            label="Email"
            register={register}
            control={control}
            checklistFn={emailChecklist}
            required={true}
          />
          <ChecklistField
            name="tcId"
            label="ID (T.C.)"
            register={register}
            control={control}
            checklistFn={idChecklist}
          />
        </div>

        <div className="flex gap-y-4 justify-center mx-auto w-full max-w-2xl">
          <ChecklistField
            name="fullName"
            label="Full Name"
            register={register}
            control={control}
            checklistFn={fullNameChecklist}
            required={true}
          />
          <ChecklistField
            name="username"
            label="Username"
            register={register}
            control={control}
            checklistFn={usernameChecklist}
            required={true}
          />
        </div>

        <div className="flex gap-y-4 justify-center mx-auto w-full max-w-2xl">
          <ChecklistField
            name="password"
            label="Password"
            register={register}
            control={control}
            checklistFn={passwordChecklist}
            type="password"
            compareField="repeatPassword"
            required={true}
          />
          <div className="flex-1 w-full max-w-[40%]">
            <Input
              {...register("repeatPassword")}
              type="password"
              placeholder="Repeat Password *"
              className="w-[90%] px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending}
          variant="default"
          className={`self-center px-8 py-2 ${
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
