import { useFetcher } from "@remix-run/react";
import { Moon, Sun } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { Theme } from "~/lib/theme.server";

interface ThemeToggleProps {
  theme: Theme;
  className?: string;
}

export function ThemeToggle({ theme, className = "" }: ThemeToggleProps) {
  const fetcher = useFetcher();
  
  // Use optimistic UI - show what the theme will be
  const optimisticTheme = fetcher.formData?.get("theme") || theme;
  const nextTheme = optimisticTheme === "light" ? "dark" : "light";
  
  return (
    <fetcher.Form method="post" action="/">
      <input type="hidden" name="theme" value={nextTheme} />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className={`relative ${className}`}
        aria-label={`Switch to ${nextTheme} mode`}
      >
        {optimisticTheme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>
    </fetcher.Form>
  );
}