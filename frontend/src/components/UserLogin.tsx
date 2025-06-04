export function UserLogin() {
  return (
    <form className="max-w-md w-full mx-auto flex flex-col gap-4 text-left">
      <div>
        <label className="block mb-1 font-medium text-sm">Email:</label>
        <input
          type="email"
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-sm">Password:</label>
        <input
          type="password"
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  )
}
