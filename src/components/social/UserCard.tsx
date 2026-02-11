"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Trophy, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole, BadgeLevel } from "@/types";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    avatar?: string | null;
    role: UserRole;
    badge: BadgeLevel;
    successRate: number;
    totalPredictions: number;
    wonPredictions: number;
  };
  rank?: number;
  isFollowing?: boolean;
  onFollow?: () => void;
  compact?: boolean;
}

const badgeStyles: Record<BadgeLevel, string> = {
  BEGINNER: "badge-beginner",
  RISING_STAR: "badge-rising-star",
  EXPERT: "badge-expert",
  MASTER: "badge-master",
};

const badgeLabels: Record<BadgeLevel, Record<string, string>> = {
  BEGINNER: { az: "Başlayan", en: "Beginner", ru: "Новичок" },
  RISING_STAR: {
    az: "Yüksələn Ulduz",
    en: "Rising Star",
    ru: "Восходящая звезда",
  },
  EXPERT: { az: "Ekspert", en: "Expert", ru: "Эксперт" },
  MASTER: { az: "Ustad", en: "Master", ru: "Мастер" },
};

export default function UserCard({
  user,
  rank,
  isFollowing,
  onFollow,
  compact,
}: UserCardProps) {
  const t = useTranslations("common");

  return (
    <Link href={`/profile/${user.id}`}>
      <div
        className={cn(
          "card-hover flex items-center gap-3",
          compact ? "p-3" : "p-4"
        )}
      >
        {rank && (
          <div
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
              rank === 1
                ? "bg-yellow-500/20 text-yellow-400"
                : rank === 2
                  ? "bg-gray-400/20 text-gray-300"
                  : rank === 3
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-dark-700 text-dark-400"
            )}
          >
            {rank}
          </div>
        )}

        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-sm font-medium">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{user.name}</span>
            <span className={badgeStyles[user.badge]}>
              {badgeLabels[user.badge]?.en}
            </span>
            {user.role === "ADMIN" && (
              <span className="text-xs bg-primary-900/50 text-primary-400 px-1.5 py-0.5 rounded">
                Editor
              </span>
            )}
            {user.role === "COLLABORATOR" && (
              <span className="text-xs bg-blue-900/50 text-blue-400 px-1.5 py-0.5 rounded">
                Pro
              </span>
            )}
          </div>
          {!compact && (
            <div className="flex items-center gap-3 text-xs text-dark-400 mt-0.5">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {user.successRate.toFixed(1)}%
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {user.wonPredictions}/{user.totalPredictions}
              </span>
            </div>
          )}
        </div>

        {onFollow && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onFollow();
            }}
            className={cn(
              "text-xs px-3 py-1.5 rounded-lg font-medium transition-colors",
              isFollowing
                ? "bg-dark-700 text-dark-300 hover:bg-dark-600"
                : "bg-primary-600 text-white hover:bg-primary-700"
            )}
          >
            {isFollowing ? t("unfollow") : t("follow")}
          </button>
        )}
      </div>
    </Link>
  );
}
