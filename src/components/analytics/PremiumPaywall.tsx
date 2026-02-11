"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Lock, Crown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumPaywallProps {
  freeAnalyticsLeft?: number;
  maxFreePerWeek?: number;
}

export default function PremiumPaywall({
  freeAnalyticsLeft = 0,
  maxFreePerWeek = 3,
}: PremiumPaywallProps) {
  const t = useTranslations("analytics");

  const benefits = [
    t("paywall.benefit1"),
    t("paywall.benefit2"),
    t("paywall.benefit3"),
  ];

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-dark-900/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-5 max-w-sm mx-auto px-6 py-8 text-center">
        {/* Lock icon */}
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/15 border border-amber-500/20">
          <Lock className="h-8 w-8 text-amber-400" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white">
          {t("paywall.title")}
        </h3>

        {/* Description */}
        <p className="text-sm text-dark-300 leading-relaxed">
          {t("paywall.description")}
        </p>

        {/* Benefits list */}
        <ul className="flex flex-col gap-2 w-full text-left">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-dark-200">
              <Zap className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        {/* Subscribe button */}
        <Link
          href="/subscription"
          className={cn(
            "inline-flex items-center gap-2 w-full justify-center px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200",
            "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-400 hover:to-amber-500",
            "shadow-lg shadow-amber-500/20"
          )}
        >
          <Crown className="h-4 w-4" />
          {t("paywall.subscribe")}
        </Link>

        {/* Free analytics counter */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800 border border-dark-700">
          <div className="flex gap-1">
            {Array.from({ length: maxFreePerWeek }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  i < freeAnalyticsLeft
                    ? "bg-emerald-500"
                    : "bg-dark-600"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-dark-400">
            {t("paywall.freeLeft", {
              count: freeAnalyticsLeft,
              max: maxFreePerWeek,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
