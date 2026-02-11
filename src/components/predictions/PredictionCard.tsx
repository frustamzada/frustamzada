"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Heart,
  MessageCircle,
  Share2,
  Lock,
  Crown,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn, truncate, formatTime } from "@/lib/utils";
import type { PredictionWithDetails } from "@/types";

interface PredictionCardProps {
  prediction: PredictionWithDetails;
  isPremiumUser?: boolean;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
}

const BADGE_COLORS: Record<string, string> = {
  BEGINNER: "bg-gray-500/10 text-gray-400 ring-gray-500/20",
  RISING_STAR: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  EXPERT: "bg-purple-500/10 text-purple-400 ring-purple-500/20",
  MASTER: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
};

const STATUS_CONFIG: Record<
  string,
  { icon: typeof CheckCircle2; color: string; bg: string }
> = {
  WON: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
  LOST: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
  PENDING: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  VOID: { icon: XCircle, color: "text-gray-400", bg: "bg-gray-500/10" },
};

export default function PredictionCard({
  prediction,
  isPremiumUser = false,
  onLike,
  onShare,
}: PredictionCardProps) {
  const t = useTranslations("predictions");
  const [liked, setLiked] = useState(prediction.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(prediction._count.likes);

  const showBlurred = prediction.isPremium && !isPremiumUser;
  const statusCfg = STATUS_CONFIG[prediction.status] ?? STATUS_CONFIG.PENDING;
  const StatusIcon = statusCfg.icon;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    onLike?.(prediction.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(prediction.id);
  };

  const confidence = prediction.confidence ?? 0;

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
        {/* User header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <Link
            href={`/users/${prediction.user.id}`}
            className="flex items-center gap-2.5 min-w-0"
          >
            {prediction.user.avatar ? (
              <img
                src={prediction.user.avatar}
                alt={prediction.user.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-dark-700"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white text-sm font-semibold ring-2 ring-dark-700">
                {prediction.user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-white truncate">
                  {prediction.user.name}
                </span>
                <span
                  className={cn(
                    "inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded ring-1",
                    BADGE_COLORS[prediction.user.badge] ?? BADGE_COLORS.BEGINNER
                  )}
                >
                  {prediction.user.badge}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <TrendingUp className="h-3 w-3" />
                <span>{prediction.user.successRate.toFixed(1)}%</span>
              </div>
            </div>
          </Link>

          {/* Status badge */}
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold",
              statusCfg.bg,
              statusCfg.color
            )}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {t(`status.${prediction.status.toLowerCase()}`)}
          </div>
        </div>

        {/* Match info */}
        <div className="mx-4 px-3 py-2 rounded-lg bg-dark-750 border border-dark-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">{prediction.match.league}</span>
            <span className="text-gray-500 tabular-nums">
              {formatTime(prediction.match.matchDate)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-gray-200 font-medium">
              {prediction.match.homeTeam}
            </span>
            {prediction.match.isLive ? (
              <span className="text-xs font-bold text-red-400 px-1.5 py-0.5 rounded bg-red-500/10">
                {prediction.match.homeScore} - {prediction.match.awayScore}
              </span>
            ) : (
              <span className="text-xs text-gray-600">vs</span>
            )}
            <span className="text-sm text-gray-200 font-medium">
              {prediction.match.awayTeam}
            </span>
          </div>
        </div>

        {/* Prediction details */}
        <div className="px-4 py-3 space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
                {t("predictionType")}
              </span>
              <p className="text-sm font-semibold text-primary-400">
                {prediction.predictionType}: {prediction.prediction}
              </p>
            </div>
            {prediction.odds != null && (
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
                  {t("odds")}
                </span>
                <p className="text-sm font-bold text-white tabular-nums">
                  {prediction.odds.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Confidence meter */}
          <div>
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
                  "h-full rounded-full transition-all duration-500",
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

          {/* Reasoning */}
          {prediction.reasoning && (
            <p className="text-xs text-gray-400 leading-relaxed">
              {truncate(prediction.reasoning, 150)}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-dark-700">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1 text-xs transition-colors",
                liked
                  ? "text-red-400"
                  : "text-gray-500 hover:text-red-400"
              )}
            >
              <Heart
                className={cn("h-4 w-4", liked && "fill-current")}
              />
              <span className="tabular-nums">{likeCount}</span>
            </button>
            <Link
              href={`/predictions/${prediction.id}`}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-400 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="tabular-nums">
                {prediction._count.comments}
              </span>
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-400 transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
          <Link
            href={`/predictions/${prediction.id}`}
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
