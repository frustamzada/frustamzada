"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocaleOption {
  code: "az" | "en" | "ru";
  flag: string;
  label: string;
}

const locales: LocaleOption[] = [
  { code: "az", flag: "\u{1F1E6}\u{1F1FF}", label: "Az\u0259rbaycanca" },
  { code: "en", flag: "\u{1F1EC}\u{1F1E7}", label: "English" },
  { code: "ru", flag: "\u{1F1F7}\u{1F1FA}", label: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439" },
];

export default function LanguageSwitcher({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const current = locales.find((l) => l.code === currentLocale) ?? locales[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(locale: "az" | "en" | "ru") {
    setOpen(false);
    router.replace(pathname, { locale });
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm",
          "bg-dark-800 border border-dark-700 text-dark-200 hover:bg-dark-700 transition-colors"
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-dark-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className={cn(
            "absolute right-0 top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded-lg",
            "border border-dark-700 bg-dark-800 shadow-lg shadow-black/30"
          )}
        >
          {locales.map((locale) => (
            <li key={locale.code}>
              <button
                type="button"
                role="option"
                aria-selected={locale.code === currentLocale}
                onClick={() => switchLocale(locale.code)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                  locale.code === currentLocale
                    ? "bg-dark-700 text-white"
                    : "text-dark-300 hover:bg-dark-700/60 hover:text-dark-100"
                )}
              >
                <span className="text-base leading-none">{locale.flag}</span>
                <span>{locale.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
