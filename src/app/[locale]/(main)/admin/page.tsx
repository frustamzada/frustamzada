"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Users, Calendar, BarChart3, Globe, Plus, Edit, Trash2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "users" | "matches" | "analytics" | "translations";

export default function AdminPage() {
  const t = useTranslations("common");
  const [activeTab, setActiveTab] = useState<Tab>("analytics");

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "users", label: "Users", icon: Users },
    { key: "matches", label: "Matches", icon: Calendar },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "translations", label: "Translations", icon: Globe },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-primary-400" />
        <h1 className="text-2xl font-bold">{t("admin")}</h1>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold">1,250</div>
          <div className="text-xs text-dark-400">Total Users</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold">85</div>
          <div className="text-xs text-dark-400">Active Matches</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold">3,420</div>
          <div className="text-xs text-dark-400">Predictions</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-win">₼2,450</div>
          <div className="text-xs text-dark-400">Revenue</div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap",
              activeTab === tab.key ? "bg-primary-600 text-white" : "bg-dark-800 text-dark-400 hover:text-dark-200"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Create Analytics Report</h2>
          </div>
          <div className="card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Report Type</label>
              <select className="input-field">
                <option value="PRE_GAME">Pre-Game Analysis</option>
                <option value="LIVE">Live Analysis</option>
                <option value="POST_GAME">Post-Game Analysis</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Title (AZ)</label>
                <input type="text" className="input-field" placeholder="Azerbaijani title..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Title (EN)</label>
                <input type="text" className="input-field" placeholder="English title..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Title (RU)</label>
                <input type="text" className="input-field" placeholder="Russian title..." />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Content (AZ)</label>
                <textarea className="input-field min-h-[150px]" placeholder="Azerbaijani content..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Content (EN)</label>
                <textarea className="input-field min-h-[150px]" placeholder="English content..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Content (RU)</label>
                <textarea className="input-field min-h-[150px]" placeholder="Russian content..." />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Sport</label>
                <select className="input-field">
                  <option value="FOOTBALL">Football</option>
                  <option value="BASKETBALL">Basketball</option>
                  <option value="TENNIS">Tennis</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">League</label>
                <input type="text" className="input-field" placeholder="League..." />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary-500" />
                  <span className="text-sm">Premium</span>
                </label>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary-500" />
                  <span className="text-sm">Featured</span>
                </label>
              </div>
            </div>
            <button className="btn-primary">Publish Report</button>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700 text-dark-400 text-sm">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Language</th>
                <th className="text-right py-3 px-4">Success Rate</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "PredictPro Admin", role: "ADMIN", lang: "AZ", rate: "70.0%" },
                { name: "Elvin Mammadov", role: "ADMIN", lang: "AZ", rate: "66.7%" },
                { name: "Rashad Aliyev", role: "COLLABORATOR", lang: "AZ", rate: "65.0%" },
                { name: "Farid Guliyev", role: "PREMIUM", lang: "EN", rate: "65.3%" },
                { name: "Aysel Huseynova", role: "FREE", lang: "AZ", rate: "62.2%" },
              ].map((user, i) => (
                <tr key={i} className="border-b border-dark-700/50 hover:bg-dark-800/50">
                  <td className="py-3 px-4 font-medium">{user.name}</td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded",
                      user.role === "ADMIN" ? "bg-primary-900/50 text-primary-400" :
                      user.role === "COLLABORATOR" ? "bg-blue-900/50 text-blue-400" :
                      user.role === "PREMIUM" ? "bg-yellow-900/50 text-yellow-400" :
                      "bg-dark-700 text-dark-300"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-dark-400">{user.lang}</td>
                  <td className="py-3 px-4 text-right">{user.rate}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-dark-400 hover:text-dark-200 mr-2"><Edit className="w-4 h-4 inline" /></button>
                    <button className="text-dark-400 hover:text-loss"><Trash2 className="w-4 h-4 inline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "matches" && (
        <div className="space-y-4">
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Match
          </button>
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700 text-dark-400 text-sm">
                  <th className="text-left py-3 px-4">Match</th>
                  <th className="text-left py-3 px-4">League</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { match: "Qarabag FK vs Neftchi PFK", league: "Azerbaijan PL", date: "Feb 7", status: "Upcoming" },
                  { match: "Arsenal vs Liverpool", league: "EPL", date: "Feb 6", status: "Live" },
                  { match: "Chelsea vs Tottenham", league: "EPL", date: "Feb 5", status: "Finished" },
                ].map((m, i) => (
                  <tr key={i} className="border-b border-dark-700/50 hover:bg-dark-800/50">
                    <td className="py-3 px-4 font-medium">{m.match}</td>
                    <td className="py-3 px-4 text-dark-400">{m.league}</td>
                    <td className="py-3 px-4 text-dark-400">{m.date}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded",
                        m.status === "Live" ? "bg-loss/10 text-loss" :
                        m.status === "Finished" ? "bg-dark-700 text-dark-300" :
                        "bg-primary-900/50 text-primary-400"
                      )}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-dark-400 hover:text-dark-200 mr-2"><Edit className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "translations" && (
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="font-bold mb-4">Manage Translations</h3>
            <div className="space-y-4">
              <div className="bg-dark-800 rounded-lg p-4">
                <div className="text-xs text-dark-400 mb-2">Key: sport_football</div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-dark-500">AZ</label>
                    <input type="text" defaultValue="Futbol" className="input-field mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-dark-500">EN</label>
                    <input type="text" defaultValue="Football" className="input-field mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-dark-500">RU</label>
                    <input type="text" defaultValue="Футбол" className="input-field mt-1" />
                  </div>
                </div>
              </div>
              <div className="bg-dark-800 rounded-lg p-4">
                <div className="text-xs text-dark-400 mb-2">Key: sport_basketball</div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-dark-500">AZ</label>
                    <input type="text" defaultValue="Basketbol" className="input-field mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-dark-500">EN</label>
                    <input type="text" defaultValue="Basketball" className="input-field mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-dark-500">RU</label>
                    <input type="text" defaultValue="Баскетбол" className="input-field mt-1" />
                  </div>
                </div>
              </div>
            </div>
            <button className="btn-primary mt-4">Save Translations</button>
          </div>
        </div>
      )}
    </div>
  );
}
