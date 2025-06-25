import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../lib/api";

export function MainPage() {
  const { data, error, isLoading } = useQuery<{ message: string }, Error>({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    retry: false,
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      {isLoading && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-transparent" />
          <p className="text-muted-foreground">Loading user profile...</p>
        </div>
      )}

      {error && (
        <div className="text-center">
          <p className="text-destructive">Error: {error.message}</p>
          <p className="text-muted-foreground">You might not be logged in.</p>
        </div>
      )}

      {data && (
        <div className="text-center">
          <h1 className="text-2xl font-bold">Main Page</h1>
          <p className="mt-4 text-lg">{data.message}</p>
        </div>
      )}
    </div>
  );
}
