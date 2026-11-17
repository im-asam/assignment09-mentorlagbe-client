"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "mentorlagbe-theme";

/** Dark/light toggle. Persists to localStorage; the layout's inline script
 * applies the saved class before first paint so there is no flash. */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Private browsing — theme just won't persist.
    }
  };

  if (!mounted) {
    return <span className="inline-block h-9 w-9" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-card text-secondary transition-colors ease-out-expo hover:bg-raised hover:text-ink"
    >
      {dark ? (
        <Sun size={18} strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Moon size={18} strokeWidth={1.5} aria-hidden="true" />
      )}
    </button>
  );
}
