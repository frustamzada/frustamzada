"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Star, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalyticsReportSummary } from "@/types";
import AnalyticsCard from "./AnalyticsCard";

type FilterTab = "featured" | "latest" | "pre-game" | "live";

interface AnalyticsListProps {
  reports: AnalyticsReportSummary[];
  isPremiumUser?: boolean;
  availableSports?: string[];
}

export default function AnalyticsList({
  reports,
  isPremiumUser = false,
  availableSports = [],
}: AnalyticsListProps) {
  const t = useTranslations("analytics");
  const [activeTab, setActiveTab] = useState<FilterTab>("featured");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [sportDropdownOpen, setSportDropdownOpen] = useState(false);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "featured", label: t("tabs.featured") },
    { key: "latest", label: t("tabs.latest") },
    { key: "pre-game", label: t("tabs.preGame") },
    { key: "live", label: t("tabs.live") },
  ];

  const featuredReports = useMemo(
    () => reports.filter((r) => r.isFeatured),
    [reports]
  );

  const filteredReports = useMemo(() => {
    let filtered = reports;

    // Apply sport filter
    if (sportFilter !== "all") {
      filtered = filtered.filter(
        (r) => r.sport?.toLowerCase() === sportFilter.toLowerCase()
      );
    }

    // Apply tab filter
    switch (activeTab) {
      case "featured":
        filtered = filtered.filter((r) => r.isFeatured);
        break;
      case "latest":
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "pre-game":
        filtered = filtered.filter(
          (r) => r.reportType.toLowerCase().replace(/_/g, "-") === "pre-game"
        );
        break;
      case "live":
        filtered = filtered.filter(
          (r) => r.reportType.toLowerCase() === "live"
        );
        break;
    }

    return filtered;
  }, [reports, activeTab, sportFilter]);

  return (
    <div className="flex flex-col gap-6">
      {/* Editor's Analytics - Featured section */}
      {featuredReports.length > 0 && activeTab !== "featured" && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            <h2 className="text-lg font-bold text-dark-100">
              {t("editorsAnalytics")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredReports.slice(0, 3).map((report) => (
              <AnalyticsCard
                key={report.id}
                report={report}
                isPremiumUser={isPremiumUser}
              />
            ))}
          </div>
        </section>
      )}

      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-dark-800 border border-dark-700">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "bg-emerald-600 text-white"
                  : "text-dark-400 hover:text-dark-200 hover:bg-dark-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sport filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setSportDropdownOpen(!sportDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-sm text-dark-300 hover:text-dark-100 hover:border-dark-600 transition-colors"
          >
            <span>
              {sportFilter === "all"
                ? t("allSports")
                : t(`sport.${sportFilter.toLowerCase()}`)}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                sportDropdownOpen && "rotate-180"
              )}
            />
          </button>

          {sportDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setSportDropdownOpen(false)}
              />
              <div className="absolute right-0 z-50 mt-1 w-44 rounded-lg bg-dark-800 border border-dark-700 shadow-lg py-1">
                <button
                  onClick={() => {
                    setSportFilter("all");
                    setSportDropdownOpen(false);
                  }}
                  className={cn(
                    "flex w-full px-4 py-2 text-sm transition-colors",
                    sportFilter === "all"
                      ? "text-emerald-400 bg-dark-700"
                      : "text-dark-300 hover:bg-dark-700 hover:text-dark-100"
                  )}
                >
                  {t("allSports")}
                </button>
                {availableSports.map((sport) => (
                  <button
                    key={sport}
                    onClick={() => {
                      setSportFilter(sport);
                      setSportDropdownOpen(false);
                    }}
                    className={cn(
                      "flex w-full px-4 py-2 text-sm transition-colors",
                      sportFilter === sport
                        ? "text-emerald-400 bg-dark-700"
                        : "text-dark-300 hover:bg-dark-700 hover:text-dark-100"
                    )}
                  >
                    {t(`sport.${sport.toLowerCase()}`)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Report grid */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <AnalyticsCard
              key={report.id}
              report={report}
              isPremiumUser={isPremiumUser}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-dark-400 text-sm">{t("noReports")}</p>
        </div>
      )}
    </div>
  );
}
