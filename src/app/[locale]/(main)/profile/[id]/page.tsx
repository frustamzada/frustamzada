import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, TrendingUp, Trophy, Users, Calendar, Star } from "lucide-react";

export default async function ProfilePage({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}) {
  const t = await getTranslations("common");
  const ts = await getTranslations("social");
  const tl = await getTranslations("leaderboard");

  const user = {
    id,
    name: "PredictPro Admin",
    role: "ADMIN",
    badge: "MASTER",
    bio: "Senior sports analyst at PredictPro. Covering Azerbaijan Premier League, Champions League, and Premier League.",
    successRate: 70.0,
    totalPredictions: 250,
    wonPredictions: 175,
    lostPredictions: 75,
    followers: 1250,
    following: 15,
    joinedDate: "2024-06-01",
    predictions: [
      { id: "p1", match: "Qarabag FK vs Neftchi PFK", prediction: "HOME @ 1.65", status: "PENDING", confidence: 8 },
      { id: "p2", match: "Arsenal vs Liverpool", prediction: "AWAY @ 2.80", status: "PENDING", confidence: 6 },
      { id: "p3", match: "Chelsea vs Tottenham", prediction: "HOME @ 1.90", status: "WON", confidence: 7 },
    ],
  };

  const badgeLabel = user.badge === "MASTER" ? (locale === "az" ? "Ustad" : locale === "ru" ? "Мастер" : "Master") :
                     user.badge === "EXPERT" ? (locale === "az" ? "Ekspert" : locale === "ru" ? "Эксперт" : "Expert") :
                     locale === "az" ? "Başlayan" : locale === "ru" ? "Новичок" : "Beginner";

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/feed" className="flex items-center gap-2 text-dark-400 hover:text-dark-200 mb-4">
        <ArrowLeft className="w-4 h-4" />
        {t("back")}
      </Link>

      {/* Profile header */}
      <div className="card p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-dark-700 flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold">{user.name}</h1>
              <span className="badge-master">{badgeLabel}</span>
              {user.role === "ADMIN" && (
                <span className="text-xs bg-primary-900/50 text-primary-400 px-2 py-0.5 rounded">Editor</span>
              )}
            </div>
            <p className="text-sm text-dark-400 mt-2">{user.bio}</p>

            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="text-dark-300"><strong className="text-dark-100">{user.followers}</strong> {ts("followers")}</span>
              <span className="text-dark-300"><strong className="text-dark-100">{user.following}</strong> {ts("following")}</span>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="btn-primary px-6">{t("follow")}</button>
              <button className="btn-secondary px-6">{t("subscribe")}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="card p-4 text-center">
          <TrendingUp className="w-5 h-5 text-primary-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-primary-400">{user.successRate}%</div>
          <div className="text-xs text-dark-400">{tl("successRate")}</div>
        </div>
        <div className="card p-4 text-center">
          <Trophy className="w-5 h-5 text-win mx-auto mb-1" />
          <div className="text-2xl font-bold text-win">{user.wonPredictions}</div>
          <div className="text-xs text-dark-400">{tl("won")}</div>
        </div>
        <div className="card p-4 text-center">
          <Star className="w-5 h-5 text-dark-400 mx-auto mb-1" />
          <div className="text-2xl font-bold">{user.totalPredictions}</div>
          <div className="text-xs text-dark-400">{tl("totalPredictions")}</div>
        </div>
        <div className="card p-4 text-center">
          <Calendar className="w-5 h-5 text-dark-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-loss">{user.lostPredictions}</div>
          <div className="text-xs text-dark-400">{tl("lost")}</div>
        </div>
      </div>

      {/* Recent Predictions */}
      <div className="card p-6">
        <h2 className="font-bold mb-4">{t("predictions")}</h2>
        <div className="space-y-3">
          {user.predictions.map((pred) => (
            <Link key={pred.id} href={`/predictions/${pred.id}`}>
              <div className="bg-dark-800 rounded-lg p-4 hover:bg-dark-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{pred.match}</div>
                    <div className="text-sm text-primary-400 mt-0.5">{pred.prediction}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-dark-400">{pred.confidence}/10</span>
                    <span className={
                      pred.status === "WON" ? "status-won" :
                      pred.status === "LOST" ? "status-lost" : "status-pending"
                    }>
                      {pred.status}
                    </span>
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
