import { getTranslations } from "next-intl/server";
import { Trophy, MessageCircle, Heart, Share2, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function PredictionDetailPage({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}) {
  const t = await getTranslations("predictions");
  const ts = await getTranslations("social");

  const prediction = {
    id,
    user: { name: "PredictPro Admin", badge: "MASTER", role: "ADMIN", successRate: 70.0 },
    match: {
      homeTeam: "Qarabag FK",
      awayTeam: "Neftchi PFK",
      league: "Azerbaijan Premier League",
      matchDate: "2025-02-07T18:00:00",
      isLive: false,
    },
    predictionType: "MATCH_WINNER",
    prediction: "HOME",
    odds: 1.65,
    confidence: 8,
    reasoning:
      "Qarabag evdə çox güclüdür. Son 10 ev matçında 8 qələbə. Neftçi səfərdə zəif formadadır. Qarabağın hücum xətti Zoubir və Wadji ilə çox təhlükəlidir.",
    status: "PENDING",
    isPremium: false,
    likes: 24,
    comments: [
      { id: "1", user: "Aysel H.", content: "Razıyam, Qarabag evdə çox güclüdür", time: "2 saat əvvəl" },
      { id: "2", user: "Farid G.", content: "Good analysis, I agree with home win", time: "1 hour ago" },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/predictions" className="flex items-center gap-2 text-dark-400 hover:text-dark-200 mb-4">
        <ArrowLeft className="w-4 h-4" />
        {t("title")}
      </Link>

      <div className="card p-6 space-y-6">
        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center font-bold">
            {prediction.user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{prediction.user.name}</span>
              <span className="badge-master">
                {prediction.user.badge === "MASTER" && (locale === "az" ? "Ustad" : locale === "ru" ? "Мастер" : "Master")}
              </span>
              <span className="text-xs bg-primary-900/50 text-primary-400 px-1.5 py-0.5 rounded">Editor</span>
            </div>
            <span className="text-sm text-dark-400">{prediction.user.successRate}% success rate</span>
          </div>
        </div>

        {/* Match */}
        <div className="bg-dark-800 rounded-lg p-4">
          <div className="text-xs text-dark-400 mb-2">{prediction.match.league}</div>
          <div className="flex items-center justify-between">
            <span className="font-medium">{prediction.match.homeTeam}</span>
            <span className="text-dark-400">vs</span>
            <span className="font-medium">{prediction.match.awayTeam}</span>
          </div>
        </div>

        {/* Prediction details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-dark-400">{t("prediction")}:</span>
            <span className="font-bold text-primary-400">{prediction.prediction} @ {prediction.odds}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-dark-400">{t("confidence")}:</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${prediction.confidence * 10}%` }} />
              </div>
              <span className="text-sm font-medium">{prediction.confidence}/10</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-dark-400">{t("status")}:</span>
            <span className="status-pending">{t("pending")}</span>
          </div>
        </div>

        {/* Reasoning */}
        <div>
          <h3 className="font-medium mb-2">{t("reasoning")}</h3>
          <p className="text-dark-300 text-sm leading-relaxed">{prediction.reasoning}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-dark-700">
          <button className="flex items-center gap-1.5 text-dark-400 hover:text-loss transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-sm">{prediction.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-dark-400 hover:text-primary-400 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{prediction.comments.length}</span>
          </button>
          <button className="flex items-center gap-1.5 text-dark-400 hover:text-primary-400 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="card p-6 mt-4">
        <h3 className="font-medium mb-4">{ts("comments")} ({prediction.comments.length})</h3>
        <div className="space-y-4">
          {prediction.comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                {comment.user.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{comment.user}</span>
                  <span className="text-xs text-dark-500">{comment.time}</span>
                </div>
                <p className="text-sm text-dark-300 mt-0.5">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-dark-700">
          <div className="flex gap-2">
            <input type="text" placeholder={ts("addComment")} className="input-field flex-1" />
            <button className="btn-primary px-4">{ts("postComment")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
