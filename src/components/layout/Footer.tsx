"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";

const LOCALES = [
  { code: "az", label: "AZ", flag: "\u{1F1E6}\u{1F1FF}" },
  { code: "en", label: "EN", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "ru", label: "RU", flag: "\u{1F1F7}\u{1F1FA}" },
] as const;

const FOOTER_LINKS = {
  product: ["feed", "matches", "predictions", "analytics", "leaderboard"],
  company: ["about", "contact", "careers", "press"],
  legal: ["terms", "privacy", "cookies"],
} as const;

export default function Footer() {
  const t = useTranslations("footer");
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (locale: "az" | "en" | "ru") => {
    router.replace(pathname, { locale });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-dark-900 border-t border-dark-700">
      {/* Disclaimer banner */}
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-4">
          <div className="flex items-start gap-3">
            <div className="flex shrink-0 items-center justify-center h-10 w-10 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <span className="text-lg font-bold text-yellow-500">18+</span>
            </div>
            <div className="flex items-start gap-2">
              <ShieldAlert className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">
                {t("disclaimer")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-primary-500 tracking-tight">
                PredictPro
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              {t("tagline")}
            </p>

            {/* Language links */}
            <div className="mt-4 flex items-center gap-2">
              {LOCALES.map((locale) => (
                <button
                  key={locale.code}
                  onClick={() => switchLocale(locale.code)}
                  className="px-2.5 py-1 text-xs rounded-md text-gray-400 hover:text-white hover:bg-dark-800 border border-dark-700 hover:border-dark-600 transition-colors"
                >
                  {locale.flag} {locale.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              {t("sections.product")}
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.product.map((key) => (
                <li key={key}>
                  <Link
                    href={`/${key}`}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {t(`links.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              {t("sections.company")}
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((key) => (
                <li key={key}>
                  <Link
                    href={`/${key}`}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {t(`links.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Responsible gambling */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              {t("sections.legal")}
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((key) => (
                <li key={key}>
                  <Link
                    href={`/${key}`}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {t(`links.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-semibold text-white mt-6 mb-3">
              {t("sections.responsibleGambling")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.begambleaware.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  BeGambleAware
                </a>
              </li>
              <li>
                <a
                  href="https://www.gamcare.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  GamCare
                </a>
              </li>
              <li>
                <a
                  href="https://www.gamblingtherapy.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  GamblingTherapy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dark-700">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600">
            &copy; {currentYear} PredictPro. {t("allRightsReserved")}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center h-6 w-8 rounded bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-bold text-yellow-500">
              18+
            </span>
            <span className="text-xs text-gray-600">{t("ageRestriction")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
