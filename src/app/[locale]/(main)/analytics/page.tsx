import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Star, Eye, Lock, Crown, TrendingUp } from "lucide-react";

const mockAnalytics = [
  {
    id: "1",
    titleAz: "Qarabag vs Neftchi - Matç Öncəsi Təhlil",
    titleEn: "Qarabag vs Neftchi - Pre-Match Analysis",
    titleRu: "Карабах vs Нефтчи - Предматчевый анализ",
    summaryAz: "Qarabag evdə favorit, Neftçi səfərdə zəif",
    summaryEn: "Qarabag strong favorites at home, Neftchi weak away",
    summaryRu: "Карабах фаворит дома, Нефтчи слаб на выезде",
    reportType: "PRE_GAME",
    isPremium: false,
    isFeatured: true,
    sport: "FOOTBALL",
    league: "Azerbaijan Premier League",
    author: { name: "PredictPro Admin", role: "ADMIN" },
    viewCount: 342,
    tags: ["qarabag", "neftchi"],
    createdAt: "2025-02-06",
  },
  {
    id: "2",
    titleAz: "Real Madrid vs Man City - Champions League Dərin Təhlil",
    titleEn: "Real Madrid vs Man City - Champions League Deep Analysis",
    titleRu: "Реал Мадрид vs Ман Сити - Глубокий анализ ЛЧ",
    summaryAz: "Hər iki komanda güclü, qollu matç gözlənilir",
    summaryEn: "Both teams in form, goals expected",
    summaryRu: "Обе команды в форме, ожидаются голы",
    reportType: "PRE_GAME",
    isPremium: true,
    isFeatured: true,
    sport: "FOOTBALL",
    league: "UEFA Champions League",
    author: { name: "Elvin Mammadov", role: "ADMIN" },
    viewCount: 567,
    tags: ["champions-league", "real-madrid", "man-city"],
    createdAt: "2025-02-06",
  },
  {
    id: "3",
    titleAz: "Arsenal vs Liverpool - Canlı Təhlil",
    titleEn: "Arsenal vs Liverpool - Live Analysis",
    titleRu: "Арсенал vs Ливерпуль - Анализ в реальном времени",
    summaryAz: "Liverpool 2-1 irəlidə, Arsenal bərabərlik axtarır",
    summaryEn: "Liverpool leading 2-1, Arsenal searching for equalizer",
    summaryRu: "Ливерпуль ведёт 2-1, Арсенал ищет ничью",
    reportType: "LIVE",
    isPremium: false,
    isFeatured: false,
    sport: "FOOTBALL",
    league: "English Premier League",
    author: { name: "PredictPro Admin", role: "ADMIN" },
    viewCount: 1205,
    tags: ["arsenal", "liverpool", "premier-league"],
    createdAt: "2025-02-06",
  },
  {
    id: "4",
    titleAz: "Həftəlik Forma Analizi - Azərbaycan Premier Liqası",
    titleEn: "Weekly Form Analysis - Azerbaijan Premier League",
    titleRu: "Еженедельный анализ формы - Премьер-лига Азербайджана",
    summaryAz: "Bütün komandaların son forma göstəriciləri",
    summaryEn: "All teams recent form indicators",
    summaryRu: "Показатели формы всех команд",
    reportType: "PRE_GAME",
    isPremium: true,
    isFeatured: false,
    sport: "FOOTBALL",
    league: "Azerbaijan Premier League",
    author: { name: "Rashad Aliyev", role: "COLLABORATOR" },
    viewCount: 189,
    tags: ["azerbaijan", "form-guide", "weekly"],
    createdAt: "2025-02-05",
  },
];

function getTitle(item: typeof mockAnalytics[0], locale: string) {
  if (locale === "ru") return item.titleRu || item.titleEn || item.titleAz;
  if (locale === "en") return item.titleEn || item.titleAz;
  return item.titleAz;
}

function getSummary(item: typeof mockAnalytics[0], locale: string) {
  if (locale === "ru") return item.summaryRu || item.summaryEn || item.summaryAz;
  if (locale === "en") return item.summaryEn || item.summaryAz;
  return item.summaryAz;
}

export default async function AnalyticsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("analytics");

  const featured = mockAnalytics.filter((a) => a.isFeatured);
  const latest = mockAnalytics.filter((a) => !a.isFeatured);

  return (
    <div>
      {/* Editor's Analytics - Featured Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-bold">{t("editorAnalytics")}</h2>
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">{t("featured")}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featured.map((item) => (
            <Link key={item.id} href={`/analytics/${item.id}`}>
              <div className="card-hover p-5 relative overflow-hidden group">
                {item.isPremium && (
                  <div className="absolute top-3 right-3 premium-badge flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Premium
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-dark-700 text-dark-300 px-2 py-0.5 rounded">
                    {item.reportType === "PRE_GAME" ? t("preGame") : item.reportType === "LIVE" ? t("live") : t("postGame")}
                  </span>
                  <span className="text-xs text-dark-400">{item.league}</span>
                </div>

                <h3 className="font-bold text-lg mb-2 group-hover:text-primary-400 transition-colors">
                  {getTitle(item, locale)}
                </h3>
                <p className="text-sm text-dark-400 mb-3">{getSummary(item, locale)}</p>

                <div className="flex items-center justify-between text-xs text-dark-500">
                  <div className="flex items-center gap-2">
                    <span className="text-primary-400">{item.author.name}</span>
                    {item.author.role === "ADMIN" && (
                      <span className="bg-primary-900/50 text-primary-400 px-1.5 py-0.5 rounded">Editor</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {item.viewCount}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Analytics */}
      <div>
        <h2 className="text-lg font-bold mb-4">{t("latest")}</h2>
        <div className="space-y-3">
          {latest.map((item) => (
            <Link key={item.id} href={`/analytics/${item.id}`}>
              <div className="card-hover p-4 flex items-start gap-4 relative">
                {item.isPremium && (
                  <div className="absolute top-3 right-3">
                    <Lock className="w-4 h-4 text-yellow-400" />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-dark-700 text-dark-300 px-2 py-0.5 rounded">
                      {item.reportType === "PRE_GAME" ? t("preGame") : item.reportType === "LIVE" ? t("live") : t("postGame")}
                    </span>
                    <span className="text-xs text-dark-500">{item.league}</span>
                  </div>
                  <h3 className="font-medium mb-1">{getTitle(item, locale)}</h3>
                  <p className="text-sm text-dark-400">{getSummary(item, locale)}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-dark-500">
                    <span>{item.author.name}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.viewCount}
                    </span>
                    <span>{item.createdAt}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
