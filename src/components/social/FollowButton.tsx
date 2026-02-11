"use client";

import { useTranslations } from "next-intl";
import { UserPlus, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  isFollowing: boolean;
  onToggle: () => void;
}

export default function FollowButton({ isFollowing, onToggle }: FollowButtonProps) {
  const t = useTranslations("social");

  return (
    <button
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900",
        isFollowing
          ? "bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 hover:bg-red-600/15 hover:text-red-400 hover:border-red-500/30 focus-visible:ring-emerald-500"
          : "bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 focus-visible:ring-emerald-500"
      )}
    >
      {isFollowing ? (
        <>
          <UserCheck className="h-4 w-4" />
          <span>{t("following")}</span>
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          <span>{t("follow")}</span>
        </>
      )}
    </button>
  );
}
