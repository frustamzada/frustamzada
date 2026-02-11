"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Heart,
  MessageCircle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Crown,
  Layers,
  ChevronRight,
} from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import type { CouponWithDetails } from "@/types";

interface CouponCardProps {
  coupon: CouponWithDetails;
  isPremiumUser?: boolean;
}

const STATUS_CONFIG: Record<
  string,
  { icon: typeof CheckCircle2; color: string; bg: string }
> = {
  WON: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
  LOST: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
  PENDING: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  VOID: { icon: XCircle, color: "text-gray-400", bg: "bg-gray-500/10" },
};

const BADGE_COLORS: Record<string, string> = {
  BEGINNER: "bg-gray-500/10 text-gray-400 ring-gray-500/20",
  RISING_STAR: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  EXPERT: "bg-purple-500/10 text-purple-400 ring-purple-500/20",
  MASTER: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
};

export default function CouponCard({
  coupon,
  isPremiumUser = false,
}: CouponCardProps) {
  const t = useTranslations("predictions");

  const showBlurred = coupon.isPremium && !isPremiumUser;
  const statusCfg = STATUS_CONFIG[coupon.status] ?? STATUS_CONFIG.PENDING;
  const StatusIcon = statusCfg.icon;
  const confidence = coupon.confidence ?? 0;

  return (
    <div className="relative rounded-xl bg-dark-800 border border-dark-700 overflow-hidden transition-all hover:border-dark-600">
      {/* Premium overlay */}
      {showBlurred && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-dark-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Crown className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-400">
              {t("premiumOnly")}
            </span>
          </div>
          <Link
            href="/premium"
            className="mt-3 text-xs text-primary-400 hover:text-primary-300 transition-colors"
          >
            {t("upgradeToPremium")}
          </Link>
        </div>
      )}

      <div className={cn(showBlurred && "blur-sm select-none")}>
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-dark-700">
          <div className="flex items-start justify-between gap-3">
            {/* User info */}
            <Link
              href={`/users/${coupon.user.id}`}
              className="flex items-center gap-2.5 min-w-0"
            >
              {coupon.user.avatar ? (
                <img
                  src={coupon.user.avatar}
                  alt={coupon.user.name}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-dark-700"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white text-sm font-semibold ring-2 ring-dark-700">
                  {coupon.user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-white truncate">
                    {coupon.user.name}
                  </span>
                  <span
                    className={cn(
                      "inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded ring-1",
                      BADGE_COLORS[coupon.user.badge] ?? BADGE_COLORS.BEGINNER
                    )}
                  >
                    {coupon.user.badge}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <TrendingUp className="h-3 w-3" />
                  <span>{coupon.user.successRate.toFixed(1)}%</span>
                </div>
              </div>
            </Link>

            {/* Status + Coupon badge */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary-500/10 text-primary-400">
                <Layers className="h-3 w-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {t("coupon")}
                </span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold",
                  statusCfg.bg,
                  statusCfg.color
                )}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {t(`status.${coupon.status.toLowerCase()}`)}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-2.5 text-base font-bold text-white">
            {coupon.title}
          </h3>
        </div>

        {/* Match predictions list */}
        <div className="divide-y divide-dark-700">
          {coupon.matches.map((mp) => {
            const mpStatus =
              STATUS_CONFIG[mp.status] ?? STATUS_CONFIG.PENDING;
            const MpStatusIcon = mpStatus.icon;

            return (
              <div key={mp.id} className="px-4 py-2.5">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-0.5">
                      <span>{mp.match.league}</span>
                      <span className="tabular-nums">
                        {formatTime(mp.match.matchDate)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-200">
                      {mp.match.homeTeam}{" "}
                      <span className="text-gray-600">vs</span>{" "}
                      {mp.match.awayTeam}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary-400">
                        {mp.predictionType}: {mp.prediction}
                      </span>
                      {mp.odds != null && (
                        <span className="text-xs font-bold text-gray-300 tabular-nums">
                          @{mp.odds.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <MpStatusIcon
                    className={cn("h-4 w-4 shrink-0 ml-2", mpStatus.color)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary section */}
        <div className="px-4 py-3 border-t border-dark-700 bg-dark-850">
          <div className="flex items-center justify-between gap-4">
            {/* Total odds */}
            {coupon.totalOdds != null && (
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
                  {t("totalOdds")}
                </span>
                <p className="text-lg font-bold text-white tabular-nums">
                  {coupon.totalOdds.toFixed(2)}
                </p>
              </div>
            )}

            {/* Confidence */}
            <div className="flex-1 max-w-[150px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
                  {t("confidence")}
                </span>
                <span className="text-xs font-bold text-gray-300 tabular-nums">
                  {confidence}/10
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-dark-700 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    confidence >= 8
                      ? "bg-green-500"
                      : confidence >= 5
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  )}
                  style={{ width: `${confidence * 10}%` }}
                />
              </div>
            </div>

            {/* Matches count */}
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
                {t("matches")}
              </span>
              <p className="text-lg font-bold text-white tabular-nums">
                {coupon.matches.length}
              </p>
            </div>
          </div>

          {/* Reasoning */}
          {coupon.reasoning && (
            <p className="mt-2 text-xs text-gray-400 leading-relaxed line-clamp-2">
              {coupon.reasoning}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-dark-700">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Heart className="h-4 w-4" />
              <span className="tabular-nums">{coupon._count.likes}</span>
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <MessageCircle className="h-4 w-4" />
              <span className="tabular-nums">{coupon._count.comments}</span>
            </span>
          </div>
          <Link
            href={`/coupons/${coupon.id}`}
            className="flex items-center gap-0.5 text-xs text-gray-500 hover:text-primary-400 transition-colors"
          >
            {t("viewDetails")}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
