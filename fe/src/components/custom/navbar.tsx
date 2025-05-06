"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, UserIcon, LogOut } from "lucide-react";

import { ThemeToggle } from "fe/components/custom/theme-toggle";
import { SearchBar } from "fe/components/search-bar";
import { Logo } from "fe/components/logo";
import { LoginButton } from "fe/components/custom/login-button";

import { Button } from "fe/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "fe/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "fe/components/ui/avatar";

import { useAuth } from "fe/hooks/use-auth";
import {
  getPrimaryDisplayValue,
  getSecondaryDisplayValue,
  getPrimaryDisplayInitials,
} from "fe/lib/user-display-utils";

export function Navbar() {
  /* -------------------------------------------------------------------- */
  /*  State / hooks                                                       */
  /* -------------------------------------------------------------------- */
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showSubheader, setShowSubheader] = React.useState(true);
  const pathname = usePathname();

  // auth
  const { isAuthenticated, user, logout } = useAuth();

  /* -------------------------------------------------------------------- */
  /*  Scroll logic to collapse / expand the sub‑header                    */
  /* -------------------------------------------------------------------- */
  React.useEffect(() => {
    const handleScroll = () =>
      setShowSubheader(window.scrollY === 0 && !isMenuOpen);

    handleScroll(); // set initial value
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  /* -------------------------------------------------------------------- */
  /*  Navigation items shown only when authed (e.g. Dashboard)            */
  /* -------------------------------------------------------------------- */
  const navItems = [
    { label: "Dashboard", href: "/dashboard", authRequired: true },
  ];

  /* -------------------------------------------------------------------- */
  /*  Render                                                              */
  /* -------------------------------------------------------------------- */
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* ---------- Sub‑header ---------- */}
      <div
        className={`w-full bg-secondary text-secondary-foreground transition-all duration-300
          ${showSubheader ? "h-8 opacity-100" : "h-0 opacity-0 overflow-hidden"}`}
      >
        <div className="container mx-auto max-w-7xl flex h-full items-center justify-end px-4 md:px-6 lg:px-8 text-sm">
          <nav className="flex items-center gap-4">
            <Link
              href="https://quran.com/"
              className="hover:text-primary transition-colors"
            >
              Qur&apos;an
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              href="/"
              className="font-bold hover:text-primary transition-colors"
            >
              Sunnah
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              href="https://salah.com/"
              className="hover:text-primary transition-colors"
            >
              Prayer Times
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              href="https://quranicaudio.com/"
              className="hover:text-primary transition-colors"
            >
              Audio
            </Link>
          </nav>
        </div>
      </div>

      {/* ---------- Main header row ---------- */}
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo ------------------------------------------------------- */}
        <Link href="/" className="flex items-center pl-0 md:pl-6">
          <Logo
            width={240}
            colorVariable="--foreground"
            className="flex-shrink-0"
          />
        </Link>

        {/* Desktop nav: search + theme toggle + auth ------------------ */}
        <nav className="hidden md:flex items-center gap-6 pr-6">
          {/* Compact search bar (hidden on homepage) */}
          {pathname !== "/" && (
            <div className="w-64 lg:w-80">
              <SearchBar size="compact" />
            </div>
          )}

          <ThemeToggle />

          {isAuthenticated() ? (
            /* Avatar menu ------------------------------------------------ */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-md hover:ring-2 hover:ring-primary/50"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.avatarUrl}
                      alt={`${getPrimaryDisplayValue(user)} Avatar`}
                    />
                    <AvatarFallback>
                      {getPrimaryDisplayInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {getPrimaryDisplayValue(user)}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {getSecondaryDisplayValue(user)}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Profile link */}
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/profile"
                    className="flex w-full items-center gap-2 py-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                {/* Sign‑out */}
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="flex w-full items-center gap-2 text-destructive py-2 hover:bg-destructive/10 rounded-md cursor-pointer transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Desktop sign‑in button ------------------------------------- */
            <Link href="/login">
              <LoginButton inNavbar text="Sign In" />
            </Link>
          )}
        </nav>

        {/* Mobile: hamburger + (optional) inline Sign In --------------- */}
        <div className="md:hidden flex items-center gap-2">
          {!isAuthenticated() && (
            <Link href="/login">
              <LoginButton inNavbar text="Sign In" />
            </Link>
          )}

          <button
            className="ml-1"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* ---------- Mobile overlay menu ---------- */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-top md:hidden bg-background">
          <div className="relative z-20 grid gap-6 p-4 rounded-md">
            <nav className="grid grid-flow-row auto-rows-max text-sm gap-2">
              {/* Theme toggle ------------------------------------------------ */}
              <ThemeToggle />

              {/* Protected nav items (e.g., Dashboard) -------------------- */}
              {navItems.map(
                ({ authRequired, label, href }) =>
                  (!authRequired || isAuthenticated()) && (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full rounded-md p-2 font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  )
              )}

              {/* Sign out / Sign in --------------------------------------- */}
              {isAuthenticated() ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-start rounded-md p-2 text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full rounded-md p-2 font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* ---------- Mobile row for search bar (non‑home only) ---------- */}
      {pathname !== "/" && (
        <div className="md:hidden w-full border-t border-border bg-background">
          <div className="container mx-auto max-w-7xl px-4 py-2">
            <SearchBar size="compact" />
          </div>
        </div>
      )}
    </header>
  );
}
