"use client";

import { useTranslations } from "next-intl";
import { Crown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

interface SubscribeButtonProps {
  isSubscribed: boolean;
  priceAZN: number;
  onToggle: () => void;
}

export default function SubscribeButton({
  isSubscribed,
  priceAZN,
  onToggle,
}: SubscribeButtonProps) {
  const t = useTranslations("social");

  return (
    <button
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900",
        isSubscribed
          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 focus-visible:ring-amber-500"
          : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 focus-visible:ring-amber-500"
      )}
    >
      {isSubscribed ? (
        <>
          <Check className="h-4 w-4" />
          <span>{t("subscribed")}</span>
        </>
      ) : (
        <>
          <Crown className="h-4 w-4" />
          <span>
            {t("subscribe")} &middot; {formatCurrency(priceAZN)}/{t("month")}
          </span>
        </>
      )}
    </button>
  );
}
