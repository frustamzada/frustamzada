import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import {
  Plus,
  Layers,
  Filter,
  ThumbsUp,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

const mockPredictions = [
  {
    id: 'pred-1',
    user: 'AzərFutbol_Pro',
    badge: 'gold',
    successRate: 72,
    match: 'Qarabağ FK vs Neftçi PFK',
    league: 'Azərbaycan Premyer Liqası',
    prediction: 'Qarabağ FK Win & Over 1.5',
    odds: 2.1,
    status: 'won' as const,
    analysis: 'Qarabağ evdə son 10 matçda 9 qalibiyyət qazanıb. Neftçi səfərdə zəif müdafiə göstərir.',
    likes: 156,
    comments: 23,
    createdAt: '2026-02-05T14:00:00Z',
  },
  {
    id: 'pred-2',
    user: 'BetKing_Baku',
    badge: 'silver',
    successRate: 68,
    match: 'Arsenal vs Manchester City',
    league: 'Premier League',
    prediction: 'Both Teams to Score',
    odds: 1.72,
    status: 'pending' as const,
    analysis: 'Both teams have scored in 7 of last 10 meetings. High-quality attacking football expected.',
    likes: 89,
    comments: 12,
    createdAt: '2026-02-06T08:00:00Z',
  },
  {
    id: 'pred-3',
    user: 'ProqnozMaster',
    badge: 'gold',
    successRate: 70,
    match: 'Zirə FK vs Sabah FK',
    league: 'Azərbaycan Premyer Liqası',
    prediction: 'Under 2.5 Goals',
    odds: 1.85,
    status: 'lost' as const,
    analysis: 'Hər iki komanda müdafiəyə üstünlük verir. Son qarşılaşmalarda az qol olub.',
    likes: 45,
    comments: 8,
    createdAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 'pred-4',
    user: 'StatsGuru_AZ',
    badge: 'platinum',
    successRate: 75,
    match: 'Real Madrid vs Barcelona',
    league: 'La Liga',
    prediction: 'Over 2.5 Goals',
    odds: 1.85,
    status: 'pending' as const,
    analysis: 'El Clásico always delivers goals. Last 5 meetings averaged 4.2 goals.',
    likes: 234,
    comments: 45,
    createdAt: '2026-02-06T06:00:00Z',
  },
];

const mockCoupons = [
  {
    id: 'coupon-1',
    user: 'CouponKing_AZ',
    badge: 'silver',
    successRate: 65,
    matches: [
      { match: 'Qarabağ FK vs Neftçi PFK', prediction: '1', odds: 1.45 },
      { match: 'Arsenal vs Man City', prediction: 'BTTS', odds: 1.72 },
      { match: 'Real Madrid vs Barcelona', prediction: 'Over 2.5', odds: 1.85 },
    ],
    totalOdds: 4.61,
    status: 'pending' as const,
    likes: 178,
    comments: 34,
    createdAt: '2026-02-06T09:00:00Z',
  },
  {
    id: 'coupon-2',
    user: 'BakuBets',
    badge: 'bronze',
    successRate: 58,
    matches: [
      { match: 'Liverpool vs Chelsea', prediction: '1', odds: 1.65 },
      { match: 'Juventus vs AC Milan', prediction: 'Under 2.5', odds: 1.95 },
      { match: 'Zirə FK vs Sabah FK', prediction: 'X', odds: 3.1 },
      { match: 'PSG vs Bayern Munich', prediction: 'BTTS', odds: 1.6 },
    ],
    totalOdds: 15.88,
    status: 'lost' as const,
    likes: 56,
    comments: 11,
    createdAt: '2026-02-05T16:00:00Z',
  },
];

const statusIcon = {
  won: <CheckCircle className="w-4 h-4 text-green-400" />,
  lost: <XCircle className="w-4 h-4 text-red-400" />,
  pending: <Clock className="w-4 h-4 text-gray-400" />,
};

const statusColor = {
  won: 'bg-green-500/20 text-green-400',
  lost: 'bg-red-500/20 text-red-400',
  pending: 'bg-gray-500/20 text-gray-400',
};

export default async function PredictionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('predictions');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('title')}</h1>
        <div className="flex gap-2">
          <Link
            href={`/${locale}/predictions/create`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('createPrediction')}
          </Link>
          <Link
            href={`/${locale}/predictions/create?tab=coupon`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
          >
            <Layers className="w-4 h-4" />
            {t('createCoupon')}
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
        <button className="flex-1 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium">
          {t('allPredictions')}
        </button>
        <button className="flex-1 px-4 py-2 rounded-md text-gray-400 hover:text-white text-sm font-medium transition-colors">
          {t('myPredictions')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-gray-500 shrink-0" />
        {['all', 'pending', 'won', 'lost'].map((filter) => (
          <button
            key={filter}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {t(`filter.${filter}`)}
          </button>
        ))}
      </div>

      {/* Predictions List */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">
          {t('singlePredictions')}
        </h2>
        <div className="space-y-3">
          {mockPredictions.map((pred) => (
            <div
              key={pred.id}
              className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:border-gray-700 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
                    {pred.user[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{pred.user}</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          pred.badge === 'platinum'
                            ? 'bg-purple-500/20 text-purple-300'
                            : pred.badge === 'gold'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-gray-500/20 text-gray-300'
                        }`}
                      >
                        {pred.badge}
                      </span>
                    </div>
                    <span className="text-xs text-green-400">{pred.successRate}%</span>
                  </div>
                </div>
                <span
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${statusColor[pred.status]}`}
                >
                  {statusIcon[pred.status]}
                  {t(`status.${pred.status}`)}
                </span>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                <p className="text-xs text-gray-400 mb-1">{pred.league}</p>
                <p className="text-sm font-medium text-gray-200">{pred.match}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-medium">
                    {pred.prediction}
                  </span>
                  <span className="text-yellow-400 font-bold">@{pred.odds}</span>
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-3">{pred.analysis}</p>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" /> {pred.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> {pred.comments}
                </span>
                <span className="ml-auto">
                  {new Date(pred.createdAt).toLocaleDateString(
                    locale === 'az' ? 'az-AZ' : locale === 'ru' ? 'ru-RU' : 'en-US'
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coupons List */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          {t('coupons')}
        </h2>
        <div className="space-y-3">
          {mockCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:border-gray-700 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
                    {coupon.user[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{coupon.user}</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          coupon.badge === 'silver'
                            ? 'bg-gray-400/20 text-gray-300'
                            : 'bg-orange-500/20 text-orange-300'
                        }`}
                      >
                        {coupon.badge}
                      </span>
                    </div>
                    <span className="text-xs text-green-400">{coupon.successRate}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${statusColor[coupon.status]}`}
                  >
                    {statusIcon[coupon.status]}
                    {t(`status.${coupon.status}`)}
                  </span>
                  <p className="text-yellow-400 font-bold text-sm mt-1">
                    {t('totalOdds')}: @{coupon.totalOdds}
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-medium text-purple-300">
                    {coupon.matches.length} {t('selections')}
                  </span>
                </div>
                {coupon.matches.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1.5 border-t border-gray-700/50 first:border-0"
                  >
                    <span className="text-gray-300">{m.match}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-300 font-medium">{m.prediction}</span>
                      <span className="text-gray-500">@{m.odds}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" /> {coupon.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> {coupon.comments}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
