"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Eye, Lock, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { AnalyticsReportSummary } from "@/types";

interface AnalyticsCardProps {
  report: AnalyticsReportSummary;
  isPremiumUser?: boolean;
}

const REPORT_TYPE_COLORS: Record<string, string> = {
  "pre-game": "bg-blue-500/15 text-blue-400 border-blue-500/20",
  live: "bg-red-500/15 text-red-400 border-red-500/20",
  "post-game": "bg-amber-500/15 text-amber-400 border-amber-500/20",
};

const ROLE_BADGE_COLORS: Record<string, string> = {
  ADMIN: "bg-red-500/15 text-red-400",
  COLLABORATOR: "bg-purple-500/15 text-purple-400",
  EDITOR: "bg-blue-500/15 text-blue-400",
};

export default function AnalyticsCard({ report, isPremiumUser = false }: AnalyticsCardProps) {
  const t = useTranslations("analytics");
  const locale = useLocale();

  const title =
    locale === "az"
      ? report.titleAz
      : locale === "ru"
        ? (report.titleRu ?? report.titleAz)
        : (report.titleEn ?? report.titleAz);

  const reportTypeKey = report.reportType.toLowerCase().replace(/_/g, "-");
  const reportTypeColor =
    REPORT_TYPE_COLORS[reportTypeKey] ?? "bg-dark-600/50 text-dark-300 border-dark-500/20";

  const roleColor =
    ROLE_BADGE_COLORS[report.author.role] ?? "bg-dark-600/50 text-dark-400";

  const isLocked = report.isPremium && !isPremiumUser;

  return (
    <Link
      href={`/analytics/${report.id}`}
      className="group flex flex-col rounded-xl bg-dark-800 border border-dark-700 overflow-hidden hover:border-dark-600 transition-colors"
    >
      {/* Cover image */}
      <div className="relative aspect-video bg-dark-700 overflow-hidden">
        {report.coverImage ? (
          <img
            src={report.coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-dark-700 to-dark-800">
            <Eye className="h-10 w-10 text-dark-600" />
          </div>
        )}

        {/* Premium lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-900/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-1.5">
              <Lock className="h-8 w-8 text-amber-400" />
              <span className="text-xs font-medium text-amber-400">
                {t("premium")}
              </span>
            </div>
          </div>
        )}

        {/* Premium badge */}
        {report.isPremium && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/90 text-white text-xs font-semibold shadow">
            <Crown className="h-3 w-3" />
            <span>Premium</span>
          </div>
        )}

        {/* Report type tag */}
        <div className="absolute top-2 left-2">
          <span
            className={cn(
              "inline-block px-2 py-0.5 rounded text-xs font-medium border",
              reportTypeColor
            )}
          >
            {t(`reportType.${reportTypeKey}`)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2.5 p-4">
        {/* Tags row */}
        <div className="flex items-center gap-2 flex-wrap">
          {report.sport && (
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-dark-700 text-dark-300 border border-dark-600">
              {t(`sport.${report.sport.toLowerCase()}`)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-dark-100 line-clamp-2 group-hover:text-white transition-colors">
          {title}
        </h3>

        {/* Author + meta */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-dark-700">
          <div className="flex items-center gap-2 min-w-0">
            {report.author.avatar ? (
              <img
                src={report.author.avatar}
                alt={report.author.name}
                className="h-6 w-6 rounded-full object-cover ring-1 ring-dark-600 shrink-0"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-dark-700 text-dark-300 text-[10px] font-semibold shrink-0">
                {report.author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm text-dark-300 truncate">
              {report.author.name}
            </span>
            <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", roleColor)}>
              {t(`role.${report.author.role.toLowerCase()}`)}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs text-dark-500">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {report.viewCount}
            </span>
            <span>{formatDate(report.createdAt, locale)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
