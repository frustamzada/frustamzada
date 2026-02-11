import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Check, Crown, Zap, BarChart3, Eye, Ban, Shield } from "lucide-react";

export default async function SubscriptionsPage() {
  const t = await getTranslations("subscription");
  const td = await getTranslations("disclaimer");

  const features = [
    { key: "unlimitedAnalytics", icon: BarChart3 },
    { key: "preGameReports", icon: Eye },
    { key: "liveAnalysis", icon: Zap },
    { key: "advancedStats", icon: BarChart3 },
    { key: "noAds", icon: Ban },
  ] as const;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      {/* Premium plan */}
      <div className="card p-8 border-primary-500/30 relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-8 h-8 text-yellow-400" />
          <div>
            <h2 className="text-xl font-bold">{t("premiumPlan")}</h2>
            <div className="text-3xl font-bold text-primary-400 mt-1">
              ₼14.99<span className="text-sm font-normal text-dark-400">/ay</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {features.map(({ key, icon: Icon }) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-primary-400" />
              </div>
              <span className="text-dark-200">{t(`features.${key}`)}</span>
            </div>
          ))}
        </div>

        <button className="btn-primary w-full py-3 text-lg font-medium">
          {t("subscribNow")}
        </button>
      </div>

      {/* Free plan comparison */}
      <div className="card p-6 mb-6">
        <h3 className="font-bold mb-4">Free Plan</h3>
        <div className="space-y-2 text-sm text-dark-400">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-dark-500" />
            <span>Create predictions and coupons</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-dark-500" />
            <span>Comment, like, share</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-dark-500" />
            <span>Follow users and collaborators</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-dark-500" />
            <span>Live scores</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-dark-500" />
            <span>2 premium analytics per week</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-dark-500" />
            <span>Leaderboard access</span>
          </div>
        </div>
      </div>

      {/* Payment info */}
      <div className="card p-6 mb-6">
        <h3 className="font-bold mb-2">Payment</h3>
        <p className="text-sm text-dark-400">
          All payments are processed in AZN (Azerbaijani Manat) through secure local payment gateways.
          Subscription renews monthly. Cancel anytime.
        </p>
      </div>

      <div className="text-center text-xs text-dark-500 flex items-center justify-center gap-2">
        <Shield className="w-4 h-4" />
        {td("text")}
      </div>
    </div>
  );
}
