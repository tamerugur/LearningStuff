import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, LoginData } from "../schemas/userSchema";
import { loginUser } from "../lib/api";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { User, Lock } from "lucide-react";
import FloatingInput from "./FloatingInput";

type ErrorState = "hidden" | "visible" | "hiding";

export function UserLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const [apiError, setApiError] = useState<string | null>(null);
  const [errorState, setErrorState] = useState<ErrorState>("hidden");

  const mutation = useMutation<{ accessToken: string }, Error, LoginData>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("data:", data);
      localStorage.setItem("authToken", data.accessToken);
      console.log("Login successful! Token stored.");
      if (errorState !== "hidden") {
        setErrorState("hiding");
      }
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
      setApiError(error.message || "Login failed");
      setErrorState("visible");
    },
  });

  useEffect(() => {
    if (errorState === "visible") {
      const timer = setTimeout(() => {
        setErrorState("hiding");
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [errorState]);

  const handleTransitionEnd = useCallback(() => {
    if (errorState === "hiding") {
      setErrorState("hidden");
      setApiError(null);
    }
  }, [errorState]);

  const handleSubmitForm = useCallback(
    (data: LoginData) => {
      mutation.mutate(data);
    },
    [mutation]
  );

  return (
    <div className="w-full flex justify-center mt-6">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="flex flex-col gap-6 text-left"
        noValidate
      >
        <FloatingInput
          type="text"
          id="identifier"
          label="Username or Email"
          required
          error={errors.identifier?.message}
          {...register("identifier")}
          leftIcon={<User className="w-4 h-4" />}
        />

        <FloatingInput
          type="password"
          id="password"
          label="Password"
          required
          error={errors.password?.message}
          {...register("password")}
           leftIcon={<Lock className="w-4 h-4" />}
        />

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={mutation.isPending}
            variant="default"
            className={`px-8 py-4 ${
              mutation.isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {mutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </div>

        {mutation.isSuccess && (
          <p className="text-green-600 text-center mt-2">Login successful!</p>
        )}

        <div
          onTransitionEnd={handleTransitionEnd}
          className={`overflow-hidden ${
            errorState === "visible" ? "max-h-10 mt-2" : "max-h-0 mt-0"
          } ${
            errorState === "hiding"
              ? "transition-all duration-500 ease-out"
              : ""
          }`}
        >
          {apiError && <p className="text-red-600 text-center">{apiError}</p>}
        </div>
      </form>
    </div>
  );
}
