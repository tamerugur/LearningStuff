export function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="p-8 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Welcome to our platform! We're dedicated to providing the best user
          experience and secure authentication system.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Our team is passionate about creating reliable and user-friendly
          solutions that make a difference in people's lives.
        </p>
      </div>
    </div>
  );
}
