import { getTranslations } from 'next-intl/server';
import {
  Star,
  TrendingUp,
  Flame,
  Filter,
  ChevronRight,
  Trophy,
  Zap,
} from 'lucide-react';

// Mock data
const editorsPicks = [
  {
    id: 'ep-1',
    title: 'Qarabağ FK dominantlığı davam edir - Çempionlar Liqası təhlili',
    titleEn: "Qarabag FK's dominance continues - Champions League analysis",
    author: 'PredictPro Editorial',
    authorAvatar: '/avatars/editor.png',
    sport: 'Football',
    match: 'Qarabağ FK vs FC Basel',
    prediction: 'Qarabağ FK Win',
    odds: 2.1,
    confidence: 85,
    isPremium: false,
    imageUrl: '/analytics/qarabag-cl.jpg',
    publishedAt: '2026-02-06T10:00:00Z',
  },
  {
    id: 'ep-2',
    title: 'Premier League Həftə 24 - Top 6 matç təhlilləri',
    titleEn: 'Premier League Matchweek 24 - Top 6 match analysis',
    author: 'PredictPro Editorial',
    authorAvatar: '/avatars/editor.png',
    sport: 'Football',
    match: 'Arsenal vs Manchester City',
    prediction: 'Both Teams to Score',
    odds: 1.72,
    confidence: 78,
    isPremium: true,
    imageUrl: '/analytics/pl-week24.jpg',
    publishedAt: '2026-02-06T08:00:00Z',
  },
  {
    id: 'ep-3',
    title: 'La Liga El Clásico xüsusi: Real Madrid vs Barcelona',
    titleEn: 'La Liga El Clásico special: Real Madrid vs Barcelona',
    author: 'PredictPro Editorial',
    authorAvatar: '/avatars/editor.png',
    sport: 'Football',
    match: 'Real Madrid vs Barcelona',
    prediction: 'Over 2.5 Goals',
    odds: 1.85,
    confidence: 82,
    isPremium: false,
    imageUrl: '/analytics/el-clasico.jpg',
    publishedAt: '2026-02-05T14:00:00Z',
  },
];

const trendingPredictions = [
  {
    id: 'tp-1',
    user: 'AzərFutbol_Pro',
    userAvatar: '/avatars/user1.png',
    badge: 'gold',
    match: 'Neftçi PFK vs Zirə FK',
    league: 'Azərbaycan Premyer Liqası',
    prediction: 'Neftçi PFK Win & Under 3.5',
    odds: 2.35,
    likes: 234,
    successRate: 72,
    sport: 'Football',
  },
  {
    id: 'tp-2',
    user: 'BetKing_Baku',
    userAvatar: '/avatars/user2.png',
    badge: 'silver',
    match: 'Liverpool vs Chelsea',
    league: 'Premier League',
    prediction: 'Liverpool Win',
    odds: 1.65,
    likes: 189,
    successRate: 68,
    sport: 'Football',
  },
  {
    id: 'tp-3',
    user: 'StatsGuru_AZ',
    userAvatar: '/avatars/user3.png',
    badge: 'platinum',
    match: 'Atletico Madrid vs Sevilla',
    league: 'La Liga',
    prediction: 'Under 2.5 Goals',
    odds: 1.9,
    likes: 156,
    successRate: 75,
    sport: 'Football',
  },
];

const hotTakes = [
  {
    id: 'ht-1',
    user: 'FutbolXəbər',
    userAvatar: '/avatars/user4.png',
    content:
      'Qarabağ FK Avro Liqasında qrup mərhələsini birinci yerlə bitirir - mərc edin!',
    contentEn:
      'Qarabag FK finishes Europa League group stage in first place - bet on it!',
    likes: 342,
    comments: 56,
    createdAt: '2026-02-06T09:30:00Z',
  },
  {
    id: 'ht-2',
    user: 'PremierInsider',
    userAvatar: '/avatars/user5.png',
    content:
      'Arsenal will go unbeaten for the rest of the season. The Invincibles 2.0 is happening.',
    likes: 278,
    comments: 89,
    createdAt: '2026-02-06T07:15:00Z',
  },
];

const socialFeed = [
  {
    id: 'sf-1',
    type: 'prediction' as const,
    user: 'ProqnozMaster',
    userAvatar: '/avatars/user6.png',
    badge: 'gold',
    match: 'Sabah FK vs Qarabağ FK',
    league: 'Azərbaycan Premyer Liqası',
    prediction: 'Qarabağ FK -1 Handicap',
    odds: 2.05,
    status: 'pending',
    createdAt: '2026-02-06T11:00:00Z',
    likes: 45,
    comments: 12,
  },
  {
    id: 'sf-2',
    type: 'coupon' as const,
    user: 'CouponKing_AZ',
    userAvatar: '/avatars/user7.png',
    badge: 'silver',
    matches: [
      { match: 'Neftçi PFK vs Zirə FK', prediction: '1', odds: 1.75 },
      { match: 'Arsenal vs Manchester City', prediction: 'BTTS', odds: 1.72 },
      {
        match: 'Real Madrid vs Barcelona',
        prediction: 'Over 2.5',
        odds: 1.85,
      },
    ],
    totalOdds: 5.52,
    status: 'pending',
    createdAt: '2026-02-06T10:30:00Z',
    likes: 89,
    comments: 23,
  },
  {
    id: 'sf-3',
    type: 'prediction' as const,
    user: 'BakuBets',
    userAvatar: '/avatars/user8.png',
    badge: 'bronze',
    match: 'Juventus vs Inter Milan',
    league: 'Serie A',
    prediction: 'Draw',
    odds: 3.2,
    status: 'won',
    createdAt: '2026-02-05T20:00:00Z',
    likes: 167,
    comments: 34,
  },
  {
    id: 'sf-4',
    type: 'prediction' as const,
    user: 'AzərFutbol_Pro',
    userAvatar: '/avatars/user1.png',
    badge: 'gold',
    match: 'PSG vs Bayern Munich',
    league: 'Champions League',
    prediction: 'Both Teams to Score & Over 2.5',
    odds: 1.95,
    status: 'pending',
    createdAt: '2026-02-06T09:00:00Z',
    likes: 112,
    comments: 28,
  },
];

const sports = [
  { key: 'all', label: 'Hamısı', labelEn: 'All' },
  { key: 'football', label: 'Futbol', labelEn: 'Football' },
  { key: 'basketball', label: 'Basketbol', labelEn: 'Basketball' },
  { key: 'tennis', label: 'Tennis', labelEn: 'Tennis' },
  { key: 'volleyball', label: 'Voleybol', labelEn: 'Volleyball' },
];

export default async function FeedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('feed');

  return (
    <div className="space-y-8">
      {/* Editor's Picks - MOST PROMINENT */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <h2 className="text-2xl font-bold text-white">
              {t('editorsPicks')}
            </h2>
          </div>
          <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            {t('seeAll')} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {editorsPicks.map((pick, idx) => (
            <div
              key={pick.id}
              className={`relative rounded-xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 hover:border-yellow-500/50 transition-all cursor-pointer group ${
                idx === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              {/* Gradient overlay placeholder for image */}
              <div
                className={`bg-gradient-to-br from-blue-900/40 to-purple-900/40 ${
                  idx === 0 ? 'h-64 md:h-full' : 'h-40'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {pick.isPremium && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium mb-2">
                    <Trophy className="w-3 h-3" /> Premium
                  </span>
                )}
                <h3
                  className={`font-bold text-white group-hover:text-yellow-300 transition-colors ${
                    idx === 0 ? 'text-xl md:text-2xl' : 'text-sm'
                  }`}
                >
                  {locale === 'en' ? pick.titleEn : pick.title}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>{pick.author}</span>
                  <span className="text-green-400 font-medium">
                    {pick.match}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-medium">
                    {pick.prediction}
                  </span>
                  <span className="text-yellow-400 text-xs font-bold">
                    @{pick.odds}
                  </span>
                  <span className="text-green-400 text-xs">
                    {pick.confidence}% {t('confidence')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-800 pb-1">
        <button className="px-4 py-2 text-sm font-medium text-blue-400 border-b-2 border-blue-400">
          {t('forYou')}
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 border-b-2 border-transparent">
          {t('allPosts')}
        </button>
      </div>

      {/* Sport filter buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Filter className="w-4 h-4 text-gray-500 shrink-0" />
        {sports.map((sport) => (
          <button
            key={sport.key}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              sport.key === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            }`}
          >
            {locale === 'en' ? sport.labelEn : sport.label}
          </button>
        ))}
      </div>

      {/* Trending Predictions */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-bold text-white">
            {t('trendingPredictions')}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {trendingPredictions.map((pred) => (
            <div
              key={pred.id}
              className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:border-green-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
                  {pred.user[0]}
                </div>
                <div>
                  <span className="text-sm font-medium text-white">
                    {pred.user}
                  </span>
                  <div className="flex items-center gap-1">
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
                    <span className="text-xs text-green-400">
                      {pred.successRate}%
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-1">{pred.league}</p>
              <p className="text-sm font-medium text-gray-200 mb-2">
                {pred.match}
              </p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 rounded bg-green-500/20 text-green-300 text-xs font-medium">
                  {pred.prediction}
                </span>
                <span className="text-yellow-400 font-bold text-sm">
                  @{pred.odds}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {pred.likes} {t('likes')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hot Takes */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-400" />
          <h2 className="text-xl font-bold text-white">{t('hotTakes')}</h2>
        </div>
        <div className="space-y-3">
          {hotTakes.map((take) => (
            <div
              key={take.id}
              className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:border-orange-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
                  {take.user[0]}
                </div>
                <span className="text-sm font-medium text-white">
                  {take.user}
                </span>
              </div>
              <p className="text-gray-200 text-sm">
                {locale === 'en' ? take.contentEn ?? take.content : take.content}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span>
                  {take.likes} {t('likes')}
                </span>
                <span>
                  {take.comments} {t('comments')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Feed */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-400" />
          {t('recentActivity')}
        </h2>
        <div className="space-y-4">
          {socialFeed.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:border-gray-700 transition-all"
            >
              {/* User header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
                  {item.user[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {item.user}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        item.badge === 'gold'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : item.badge === 'silver'
                            ? 'bg-gray-400/20 text-gray-300'
                            : 'bg-orange-500/20 text-orange-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleTimeString(
                      locale === 'az' ? 'az-AZ' : locale === 'ru' ? 'ru-RU' : 'en-US',
                      { hour: '2-digit', minute: '2-digit' }
                    )}
                  </span>
                </div>
                {item.status && (
                  <span
                    className={`ml-auto text-xs px-2 py-1 rounded-full font-medium ${
                      item.status === 'won'
                        ? 'bg-green-500/20 text-green-400'
                        : item.status === 'lost'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {item.status === 'won'
                      ? t('won')
                      : item.status === 'lost'
                        ? t('lost')
                        : t('pending')}
                  </span>
                )}
              </div>

              {/* Content */}
              {item.type === 'prediction' && (
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">
                    {item.league}
                  </p>
                  <p className="text-sm font-medium text-gray-200">
                    {item.match}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-medium">
                      {item.prediction}
                    </span>
                    <span className="text-yellow-400 font-bold text-sm">
                      @{item.odds}
                    </span>
                  </div>
                </div>
              )}

              {item.type === 'coupon' && item.matches && (
                <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">
                      {t('coupon')} ({item.matches.length} {t('matches')})
                    </span>
                    <span className="text-yellow-400 font-bold text-sm ml-auto">
                      {t('totalOdds')}: @{item.totalOdds}
                    </span>
                  </div>
                  {item.matches.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs py-1 border-t border-gray-700/50 first:border-0"
                    >
                      <span className="text-gray-300">{m.match}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-300">{m.prediction}</span>
                        <span className="text-gray-500">@{m.odds}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span>
                  {item.likes} {t('likes')}
                </span>
                <span>
                  {item.comments} {t('comments')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
