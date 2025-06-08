import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, LoginData } from "../schemas/userSchema";
import { loginUser } from "../lib/api";
import { useState, useEffect } from "react";

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

  const mutation = useMutation<{ token: string }, Error, LoginData>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
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
  }, [errorState, apiError]);

  const handleTransitionEnd = () => {
    if (errorState === "hiding") {
      setErrorState("hidden");
      setApiError(null);
    }
  };

  const onSubmit = (data: LoginData) => {
    mutation.mutate(data);
  };

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl flex flex-col gap-6 text-left"
      >
        <div className="flex flex-col items-center gap-1">
          <div className="w-1/2">
            <label className="block mb-1 font-medium text-sm text-left">
              Email/Username:
            </label>
            <input
              {...register("identifier")}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            {errors.identifier && (
              <p className="text-red-500 text-xs mt-1">
                {errors.identifier.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-1/2">
            <label className="block mb-1 font-medium text-sm text-left">
              Password:
            </label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className={`bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition self-center ${
            mutation.isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>

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
