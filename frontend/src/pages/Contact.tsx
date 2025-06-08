export function Contact() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="p-8 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-sm">Name:</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm">Email:</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm">Message:</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
