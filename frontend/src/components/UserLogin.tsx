export function UserLogin() {
  return (
    <div className="w-full flex justify-center">
      <form className="w-full max-w-2xl flex flex-col gap-6 text-left">
        <div className="flex flex-col items-center gap-1">
          <div className="w-1/2">
            <label className="block mb-1 font-medium text-sm text-left">
              Email/Username:
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-1/2">
            <label className="block mb-1 font-medium text-sm text-left">
              Password:
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition self-center"
        >
          Login
        </button>
      </form>
    </div>
  );
}
