"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Users, DollarSign, TrendingUp, Trophy, Plus, Edit, Trash2 } from "lucide-react";

export default function CollaboratorDashboardPage() {
  const t = useTranslations("collaborator");
  const tc = useTranslations("common");
  const tp = useTranslations("predictions");

  const stats = {
    totalFollowers: 342,
    paidSubscribers: 58,
    totalEarnings: 578.42,
    platformCommission: 115.68,
    netEarnings: 462.74,
    successRate: 65.0,
    subscriptionPrice: 9.99,
  };

  const myPredictions = [
    { id: "1", match: "Real Madrid vs Man City", prediction: "OVER 2.5 @ 1.85", status: "PENDING", isPremium: true, date: "2025-02-06" },
    { id: "2", match: "Chelsea vs Tottenham", prediction: "HOME @ 1.90", status: "WON", isPremium: false, date: "2025-02-05" },
    { id: "3", match: "Barcelona vs Atletico", prediction: "BTTS @ 1.75", status: "LOST", isPremium: true, date: "2025-02-04" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Link href="/predictions/create" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t("createContent")}
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="card p-4">
          <Users className="w-5 h-5 text-primary-400 mb-2" />
          <div className="text-2xl font-bold">{stats.totalFollowers}</div>
          <div className="text-xs text-dark-400">{t("totalFollowers")}</div>
        </div>
        <div className="card p-4">
          <Users className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl font-bold">{stats.paidSubscribers}</div>
          <div className="text-xs text-dark-400">{t("paidSubscribers")}</div>
        </div>
        <div className="card p-4">
          <DollarSign className="w-5 h-5 text-win mb-2" />
          <div className="text-2xl font-bold text-win">₼{stats.netEarnings.toFixed(2)}</div>
          <div className="text-xs text-dark-400">{t("netEarnings")}</div>
        </div>
        <div className="card p-4">
          <TrendingUp className="w-5 h-5 text-primary-400 mb-2" />
          <div className="text-2xl font-bold text-primary-400">{stats.successRate}%</div>
          <div className="text-xs text-dark-400">Success Rate</div>
        </div>
      </div>

      {/* Earnings breakdown */}
      <div className="card p-6 mb-6">
        <h2 className="font-bold mb-4">{t("earnings")}</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">{t("earnings")}</span>
            <span className="font-medium">₼{stats.totalEarnings.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">{t("commission")}</span>
            <span className="font-medium text-loss">-₼{stats.platformCommission.toFixed(2)}</span>
          </div>
          <div className="border-t border-dark-700 pt-3 flex items-center justify-between">
            <span className="font-medium">{t("netEarnings")}</span>
            <span className="font-bold text-lg text-win">₼{stats.netEarnings.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Subscription price */}
      <div className="card p-6 mb-6">
        <h2 className="font-bold mb-4">{t("setSubscriptionPrice")}</h2>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">₼</span>
            <input
              type="number"
              defaultValue={stats.subscriptionPrice}
              className="input-field pl-8"
              step="0.01"
              min="0.99"
            />
          </div>
          <span className="text-sm text-dark-400">/month</span>
          <button className="btn-primary">{tc("save")}</button>
        </div>
      </div>

      {/* My predictions */}
      <div className="card p-6">
        <h2 className="font-bold mb-4">{tp("myPredictions")}</h2>
        <div className="space-y-3">
          {myPredictions.map((pred) => (
            <div key={pred.id} className="bg-dark-800 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{pred.match}</span>
                  {pred.isPremium && <span className="premium-badge text-xs">Premium</span>}
                </div>
                <div className="text-sm text-primary-400 mt-0.5">{pred.prediction}</div>
                <div className="text-xs text-dark-500 mt-0.5">{pred.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={
                  pred.status === "WON" ? "status-won" :
                  pred.status === "LOST" ? "status-lost" : "status-pending"
                }>
                  {pred.status}
                </span>
                <button className="text-dark-400 hover:text-dark-200"><Edit className="w-4 h-4" /></button>
                <button className="text-dark-400 hover:text-loss"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
