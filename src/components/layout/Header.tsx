"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Menu, X, Search, User, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { key: "feed", href: "/feed" },
  { key: "matches", href: "/matches" },
  { key: "predictions", href: "/predictions" },
  { key: "analytics", href: "/analytics" },
  { key: "leaderboard", href: "/leaderboard" },
] as const;

const LOCALES = [
  { code: "az", label: "AZ", flag: "\u{1F1E6}\u{1F1FF}" },
  { code: "en", label: "EN", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "ru", label: "RU", flag: "\u{1F1F7}\u{1F1FA}" },
] as const;

interface HeaderProps {
  isLoggedIn?: boolean;
  username?: string;
  avatarUrl?: string;
}

export default function Header({
  isLoggedIn = false,
  username,
  avatarUrl,
}: HeaderProps) {
  const t = useTranslations("header");
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const switchLocale = (locale: "az" | "en" | "ru") => {
    router.replace(pathname, { locale });
    setLangDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-dark-900 border-b border-dark-700">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold text-primary-500 tracking-tight">
            PredictPro
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 ml-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-primary-400 bg-dark-800"
                  : "text-gray-300 hover:text-white hover:bg-dark-800"
              )}
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Link
            href="/search"
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-800 transition-colors"
            aria-label={t("search")}
          >
            <Search className="h-5 w-5" />
          </Link>

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-800 transition-colors"
              aria-label={t("switchLanguage")}
            >
              <Globe className="h-5 w-5" />
              <ChevronDown className="h-3 w-3" />
            </button>

            {langDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-2 w-36 rounded-lg bg-dark-800 border border-dark-700 shadow-lg py-1">
                  {LOCALES.map((locale) => (
                    <button
                      key={locale.code}
                      onClick={() => switchLocale(locale.code)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
                    >
                      <span>{locale.flag}</span>
                      <span>{locale.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Auth / User */}
          {isLoggedIn ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-md hover:bg-dark-800 transition-colors"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={username ?? ""}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-dark-700"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-sm font-semibold">
                    {username?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                )}
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg bg-dark-800 border border-dark-700 shadow-lg py-1">
                    <div className="px-4 py-2 border-b border-dark-700">
                      <p className="text-sm font-medium text-white truncate">
                        {username}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
                    >
                      {t("profile")}
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
                    >
                      {t("settings")}
                    </Link>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-700 transition-colors">
                      {t("logout")}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition-colors"
              >
                {t("register")}
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-800 transition-colors"
            aria-label={mobileMenuOpen ? t("closeMenu") : t("openMenu")}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-dark-700",
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-t-0"
        )}
      >
        <nav className="flex flex-col px-4 py-3 space-y-1 bg-dark-900">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-primary-400 bg-dark-800"
                  : "text-gray-300 hover:text-white hover:bg-dark-800"
              )}
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}

          {!isLoggedIn && (
            <div className="flex gap-2 pt-3 border-t border-dark-700 mt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center px-4 py-2.5 text-sm font-medium rounded-lg border border-dark-600 text-gray-300 hover:text-white hover:border-dark-500 transition-colors"
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center px-4 py-2.5 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition-colors"
              >
                {t("register")}
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
