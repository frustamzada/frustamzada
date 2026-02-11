import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Eye, Calendar, User, Lock, Crown } from "lucide-react";

export default async function AnalyticsDetailPage({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}) {
  const t = await getTranslations("analytics");

  const report = {
    id,
    reportType: "PRE_GAME",
    isPremium: false,
    sport: "FOOTBALL",
    league: "Azerbaijan Premier League",
    titleAz: "Qarabag vs Neftchi - Matç Öncəsi Təhlil",
    titleEn: "Qarabag vs Neftchi - Pre-Match Analysis",
    titleRu: "Карабах vs Нефтчи - Предматчевый анализ",
    contentAz: `Qarabag bu mövsüm evdə əla forma nümayiş etdirir. Son 10 ev matçında 8 qələbə əldə edərək, cəmi 2 heç-heçə ilə kifayətləniblər. Neftçi isə səfərdə problemlər yaşayır - son 5 səfər matçında cəmi 1 qələbə.

Qarabağın hücum xətti Zoubir və Wadji ilə çox təhlükəlidir. Neftçinin müdafiəsi son matçlarda zəif görünür.

**Statistika:**
- Qarabag ev matçları: 8Q 2H 0M
- Neftchi səfər matçları: 1Q 1H 3M
- Son üz-üzə: Qarabag 3 - 0 Neftchi
- Orta qol: 2.8 per matç

**Məşqçi analizi:**
Qarabağın baş məşqçisi komandanı yaxşı hazırlayıb. Taktiki baxımdan 4-3-3 formasiyası ilə oynayacaqlar. Neftçi isə müdafiə xəttində dəyişikliklər edib.

**Zədə hesabatı:**
- Qarabag: Bütün əsas oyunçular sağlamdır
- Neftchi: 2 müdafiəçi zədəli`,
    contentEn: `Qarabag has been in excellent home form this season. In their last 10 home matches, they secured 8 victories with only 2 draws. Neftchi struggles away from home - just 1 win in their last 5 away games.

Qarabag's attacking line with Zoubir and Wadji poses a significant threat. Neftchi's defense has looked vulnerable in recent matches.

**Statistics:**
- Qarabag home record: 8W 2D 0L
- Neftchi away record: 1W 1D 3L
- Last H2H: Qarabag 3 - 0 Neftchi
- Average goals: 2.8 per match

**Coach Analysis:**
Qarabag's head coach has prepared the team well. Tactically they will play in a 4-3-3 formation. Neftchi made changes in their defensive line.

**Injury Report:**
- Qarabag: All key players fit
- Neftchi: 2 defenders injured`,
    contentRu: `Карабах демонстрирует отличную домашнюю форму в этом сезоне. В последних 10 домашних матчах они одержали 8 побед при 2 ничьих. Нефтчи испытывает трудности на выезде - всего 1 победа в последних 5 выездных матчах.

**Статистика:**
- Домашний рекорд Карабаха: 8П 2Н 0П
- Выездной рекорд Нефтчи: 1П 1Н 3П
- Последняя встреча: Карабах 3 - 0 Нефтчи`,
    author: { name: "PredictPro Admin", role: "ADMIN" },
    viewCount: 342,
    tags: ["qarabag", "neftchi", "azerbaijan-premier-league"],
    createdAt: "2025-02-06",
  };

  const getTitle = () => {
    if (locale === "ru") return report.titleRu || report.titleEn || report.titleAz;
    if (locale === "en") return report.titleEn || report.titleAz;
    return report.titleAz;
  };

  const getContent = () => {
    if (locale === "ru") return report.contentRu || report.contentEn || report.contentAz;
    if (locale === "en") return report.contentEn || report.contentAz;
    return report.contentAz;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/analytics" className="flex items-center gap-2 text-dark-400 hover:text-dark-200 mb-4">
        <ArrowLeft className="w-4 h-4" />
        {t("title")}
      </Link>

      <article className="card p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs bg-dark-700 text-dark-300 px-2 py-0.5 rounded">
            {report.reportType === "PRE_GAME" ? t("preGame") : report.reportType === "LIVE" ? t("live") : t("postGame")}
          </span>
          <span className="text-xs text-dark-400">{report.league}</span>
          {report.isPremium && (
            <span className="premium-badge flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Premium
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-4">{getTitle()}</h1>

        <div className="flex items-center gap-4 text-sm text-dark-400 mb-8 pb-4 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-xs font-medium">
              {report.author.name.charAt(0)}
            </div>
            <span className="text-primary-400">{report.author.name}</span>
            <span className="text-xs bg-primary-900/50 text-primary-400 px-1.5 py-0.5 rounded">Editor</span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {report.createdAt}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {report.viewCount}
          </span>
        </div>

        <div className="prose prose-invert max-w-none">
          {getContent().split("\n\n").map((paragraph, i) => (
            <div key={i} className="mb-4">
              {paragraph.startsWith("**") ? (
                <h3 className="font-bold text-dark-100 mb-2">
                  {paragraph.replace(/\*\*/g, "")}
                </h3>
              ) : paragraph.startsWith("- ") ? (
                <ul className="space-y-1 text-dark-300 text-sm">
                  {paragraph.split("\n").map((line, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-primary-400 mt-1">•</span>
                      {line.replace("- ", "")}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-dark-300 leading-relaxed">{paragraph}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-6 pt-4 border-t border-dark-700">
          {report.tags.map((tag) => (
            <span key={tag} className="text-xs bg-dark-800 text-dark-400 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}
