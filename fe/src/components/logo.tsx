"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface LogoProps {
  width?: number;
  className?: string;
  colorVariable?: string;
}

export function Logo({
  width = 120,
  className = "",
  colorVariable = "--primary", // Default to primary color, but allow override
}: LogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [themeColor, setThemeColor] = useState("");

  // Default fallback color (should only be used during SSR)
  const fallbackColor = "50a3a3";

  // Only show the logo after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);

    // Use a small timeout to ensure the theme has been fully applied to the DOM
    // This is crucial for getting the correct CSS variable values after theme changes
    const timeoutId = setTimeout(() => {
      try {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);

        // Make sure we're using the variable name correctly (with or without --)
        const varName = colorVariable.startsWith("--")
          ? colorVariable
          : `--${colorVariable}`;

        // Get the computed value of the CSS variable
        let cssVarValue = computedStyle.getPropertyValue(varName).trim();

        // If empty, try without -- prefix as fallback
        if (!cssVarValue && varName.startsWith("--")) {
          cssVarValue = computedStyle
            .getPropertyValue(varName.substring(2))
            .trim();
        }

        // Convert the CSS variable value to a hex color without the #
        const hexColor = cssVarValue.startsWith("#")
          ? cssVarValue.substring(1)
          : cssVarValue;

        if (hexColor) {
          setThemeColor(hexColor);
        } else {
          console.warn(
            `Could not get color value for ${colorVariable}, using fallback`
          );
          setThemeColor(fallbackColor);
        }
      } catch (error) {
        console.error("Error getting theme color:", error);
        setThemeColor(fallbackColor);
      }
    }, 50); // Small delay to ensure theme is applied

    return () => clearTimeout(timeoutId);
  }, [theme, colorVariable, fallbackColor]); // Re-run when theme or colorVariable changes

  // Use the theme color or fallback if not available yet
  const color = themeColor || fallbackColor;

  // Construct the dynamic URL
  const imageUrl = `https://imgstore.org/icon/6a08zkwh789g/${color}/${
    width * 3
  }`;

  if (!mounted) {
    // Return a placeholder with the width to avoid layout shift
    return <div style={{ width }} className={className} />;
  }

  return (
    <div className={`flex items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="NextSunnah Logo"
        width={width}
        style={{ width }}
        referrerPolicy="unsafe-url"
      />
    </div>
  );
}
