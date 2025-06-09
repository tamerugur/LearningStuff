import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .refine((val) => val.trim().split(/\s+/).length >= 2, {
        message: "Please enter both name and surname",
      })
      .transform((val) =>
        val
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      ),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(16, "Username must be at most 16 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    tcId: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .string()
        .regex(/^[1-9][0-9]{10}$/, "TC must be 11 digits and not start with 0")
        .refine(isValidTurkishID, "Invalid Turkish ID number")
        .optional()
    ),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      )
      .regex(/\d/, "Password must contain at least one digit"),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
  });

export type RegisterData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginData = z.infer<typeof loginSchema>;

function isValidTurkishID(tc: string): boolean {
  const digits = tc.split("").map(Number);
  if (digits.length !== 11) return false;
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
  const digit10 = (oddSum * 7 - evenSum) % 10;
  const digit11 = digits.slice(0, 10).reduce((sum, d) => sum + d, 0) % 10;
  return digits[9] === digit10 && digits[10] === digit11;
}
