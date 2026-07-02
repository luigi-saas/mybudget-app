"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const LOCALES: { code: string; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs text-muted"
      >
        <span className="text-sm">{current.flag}</span>
        <span className="font-semibold text-sm">{current.label}</span>
        <svg
          className="ml-2 h-3 w-3 text-muted"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-44 rounded-lg border border-border bg-white shadow-lg"
        >
          {LOCALES.map((l) => (
            <li key={l.code}>
              <Link
                href={`/${l.code}`}
                className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-bg"
                onClick={() => setOpen(false)}
              >
                <span className="text-lg">{l.flag}</span>
                <span className="truncate">{l.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
