import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            Your Logo
          </Link>
          <nav className="hidden sm:flex items-center gap-4">
            <Link
              to="/"
              className={`transition ${
                isActive("/")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`transition ${
                isActive("/about")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`transition ${
                isActive("/contact")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
