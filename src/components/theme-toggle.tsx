"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <Sun className="mr-2 h-4 w-4" />
        <span>Tema</span>
      </div>
      <button
        aria-label="Toggle theme"
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors dark:bg-gray-700"
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
            isDark ? "translate-x-6" : "translate-x-1"
          }`}
        >
          <span className="flex h-full w-full items-center justify-center">
            {isDark ? (
              <Moon className="h-2 w-2 text-gray-600" />
            ) : (
              <Sun className="h-2 w-2 text-yellow-500" />
            )}
          </span>
        </span>
      </button>
    </div>
  );
}