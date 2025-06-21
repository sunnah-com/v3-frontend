import { Link, useLocation } from "@remix-run/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "../logo";
import { SearchBar } from "../search-bar";
import { UserMenu } from "../auth/user-menu";
import { ThemeToggle } from "../theme-toggle";
import type { Theme } from "~/lib/theme.server";

interface NavbarProps {
  theme: Theme;
}

export function Navbar({ theme }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="navbar-with-scroll-hide w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* ---------- Sub‑header ---------- */}
      <div
        className="w-full bg-secondary text-secondary-foreground h-8"
      >
        <div className="container mx-auto max-w-7xl flex h-full items-center justify-end px-4 md:px-6 lg:px-8 text-sm">
          <nav className="flex items-center gap-4">
            <Link
              to="https://quran.com/"
              className="hover:text-primary transition-colors"
            >
              Qur&apos;an
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              to="/"
              className="font-bold hover:text-primary transition-colors"
            >
              Sunnah
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              to="https://salah.com/"
              className="hover:text-primary transition-colors"
            >
              Prayer Times
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              to="https://quranicaudio.com/"
              className="hover:text-primary transition-colors"
            >
              Audio
            </Link>
          </nav>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center pl-0 md:pl-6">
          <Logo
            width={240}
            colorVariable="--foreground"
            className="flex-shrink-0"
          />
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 pr-6">
          {/* Compact search bar (hidden on homepage) */}
          {pathname !== "/" && (
            <div className="w-64 lg:w-80">
              <SearchBar size="compact" />
            </div>
          )}

          <Link
            to="/collections"
            className="text-sm font-medium hover:text-primary"
          >
            Collections
          </Link>

          <Link
            to="/about"
            className="text-sm font-medium hover:text-primary"
          >
            About
          </Link>

          {/* Theme toggle */}
          <ThemeToggle theme={theme} />

          {/* User menu */}
          <UserMenu />
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container px-4 py-3">
            {pathname !== "/" && (
              <div className="mb-4">
                <SearchBar />
              </div>
            )}
            <div className="flex flex-col space-y-3">
              <Link
                to="/collections"
                className="text-sm font-medium py-2 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Collections
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium py-2 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              {/* Mobile theme toggle and user menu */}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle theme={theme} />
                </div>
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 