import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-semibold text-foreground">
            Your Logo
          </Link>
          <nav className="hidden sm:flex items-center gap-4">
            <Link
              to="/"
              className={`transition ${
                isActive("/")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`transition ${
                isActive("/about")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`transition ${
                isActive("/contact")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
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
