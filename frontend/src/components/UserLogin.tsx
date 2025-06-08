import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, LoginData } from "../schemas/userSchema";
import { loginUser } from "../lib/api";

export function UserLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      console.log("Login successful!");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

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
        {mutation.isError && (
          <p className="text-red-600 text-center mt-2">
            {mutation.error?.message || "Login failed"}
          </p>
        )}
      </form>
    </div>
  );
}
