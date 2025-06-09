import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../lib/api";

export function MainPage() {
  const { data, error, isLoading } = useQuery<{ message: string }, Error>({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    retry: false, // Do not retry on 401/404 errors
  });

  if (isLoading) {
    return (
      <div className="text-center mt-10">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Error: {error.message}</p>
        <p>You might not be logged in.</p>
      </div>
    );
  }

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">Main Page</h1>
      <p className="mt-4 text-lg">{data?.message}</p>
    </div>
  );
}
