import { getTranslations } from 'next-intl/server';
import {
  ArrowLeft,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Users,
  Target,
  Activity,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

// Mock match data
const mockMatch = {
  id: 'match-4',
  homeTeam: 'Real Madrid',
  awayTeam: 'Barcelona',
  homeScore: null,
  awayScore: null,
  kickoff: '2026-02-06T21:00:00Z',
  league: 'La Liga',
  season: '2025/2026',
  stadium: 'Santiago Bernabéu',
  sport: 'football',
  status: 'upcoming',
  homeLogo: '/teams/realmadrid.png',
  awayLogo: '/teams/barcelona.png',
  odds: {
    home: { current: 2.2, opening: 2.35, high: 2.4, low: 2.15 },
    draw: { current: 3.5, opening: 3.4, high: 3.6, low: 3.3 },
    away: { current: 3.0, opening: 2.85, high: 3.1, low: 2.8 },
    over25: { current: 1.85, opening: 1.9, high: 1.95, low: 1.8 },
    under25: { current: 1.95, opening: 1.9, high: 2.0, low: 1.85 },
    btts: { current: 1.72, opening: 1.75, high: 1.8, low: 1.7 },
  },
  bookmakers: [
    { name: 'Bet365', home: 2.25, draw: 3.5, away: 2.95 },
    { name: '1xBet', home: 2.22, draw: 3.55, away: 3.0 },
    { name: 'Topaz', home: 2.18, draw: 3.45, away: 3.05 },
    { name: 'Mostbet', home: 2.2, draw: 3.5, away: 3.0 },
    { name: 'Pin-Up', home: 2.15, draw: 3.4, away: 3.1 },
  ],
  stats: {
    homeForm: ['W', 'W', 'D', 'W', 'L'],
    awayForm: ['W', 'L', 'W', 'W', 'W'],
    h2h: [
      { date: '2025-10-26', home: 'Barcelona', away: 'Real Madrid', score: '2-1' },
      { date: '2025-04-21', home: 'Real Madrid', away: 'Barcelona', score: '3-2' },
      { date: '2024-10-28', home: 'Barcelona', away: 'Real Madrid', score: '1-1' },
      { date: '2024-04-21', home: 'Real Madrid', away: 'Barcelona', score: '3-2' },
    ],
    homeStats: {
      goalsScored: 48,
      goalsConceded: 18,
      cleanSheets: 8,
      avgGoals: 2.5,
      possession: 58,
    },
    awayStats: {
      goalsScored: 52,
      goalsConceded: 22,
      cleanSheets: 6,
      avgGoals: 2.7,
      possession: 62,
    },
  },
};

const matchPredictions = [
  {
    id: 'mp-1',
    user: 'AzərFutbol_Pro',
    badge: 'gold',
    successRate: 72,
    prediction: 'Real Madrid Win',
    odds: 2.2,
    analysis: 'Real Madrid have been dominant at home this season with 12 wins in 14 matches. Vinicius Jr in great form.',
    likes: 89,
    createdAt: '2026-02-06T08:00:00Z',
  },
  {
    id: 'mp-2',
    user: 'StatsGuru_AZ',
    badge: 'platinum',
    successRate: 75,
    prediction: 'Both Teams to Score',
    odds: 1.72,
    analysis: 'El Clásico matches have seen BTTS in 8 of the last 10 meetings. Both attacks are firing this season.',
    likes: 134,
    createdAt: '2026-02-06T07:30:00Z',
  },
  {
    id: 'mp-3',
    user: 'BetKing_Baku',
    badge: 'silver',
    successRate: 68,
    prediction: 'Over 2.5 Goals',
    odds: 1.85,
    analysis: 'High-scoring affair expected. Last 5 El Clásicos averaged 4.2 goals per match.',
    likes: 67,
    createdAt: '2026-02-06T06:00:00Z',
  },
];

const matchAnalytics = [
  {
    id: 'ma-1',
    title: 'El Clásico Tactical Breakdown: What to Expect',
    author: 'PredictPro Editorial',
    isPremium: false,
    excerpt: 'Ancelotti vs Flick tactical analysis, key matchups and predicted lineups.',
    publishedAt: '2026-02-06T06:00:00Z',
  },
  {
    id: 'ma-2',
    title: 'Data-Driven El Clásico: xG, Possession Patterns & Set Pieces',
    author: 'PredictPro Analytics',
    isPremium: true,
    excerpt: 'Deep statistical analysis with expected goals models and set piece data.',
    publishedAt: '2026-02-05T18:00:00Z',
  },
];

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations('matchDetail');

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href={`/${locale}/matches`}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('backToMatches')}
      </Link>

      {/* Match Header */}
      <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 p-6">
        <div className="text-center">
          <span className="text-xs text-gray-400">{mockMatch.league} - {mockMatch.season}</span>
          <p className="text-xs text-gray-500 mt-0.5">{mockMatch.stadium}</p>
        </div>

        <div className="flex items-center justify-between mt-6">
          {/* Home team */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold text-white mb-2">
              RM
            </div>
            <h3 className="font-bold text-white text-lg">{mockMatch.homeTeam}</h3>
            <div className="flex justify-center gap-1 mt-2">
              {mockMatch.stats.homeForm.map((result, i) => (
                <span
                  key={i}
                  className={`w-6 h-6 rounded text-xs flex items-center justify-center font-bold ${
                    result === 'W'
                      ? 'bg-green-600 text-white'
                      : result === 'D'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-red-600 text-white'
                  }`}
                >
                  {result}
                </span>
              ))}
            </div>
          </div>

          {/* Score / Time */}
          <div className="px-6 text-center">
            {mockMatch.status === 'upcoming' ? (
              <>
                <div className="text-3xl font-bold text-gray-400">VS</div>
                <div className="text-sm text-blue-400 mt-1">
                  {new Date(mockMatch.kickoff).toLocaleTimeString(
                    locale === 'az' ? 'az-AZ' : locale === 'ru' ? 'ru-RU' : 'en-US',
                    { hour: '2-digit', minute: '2-digit' }
                  )}
                </div>
              </>
            ) : (
              <div className="text-4xl font-bold text-white">
                {mockMatch.homeScore} - {mockMatch.awayScore}
              </div>
            )}
          </div>

          {/* Away team */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold text-white mb-2">
              FCB
            </div>
            <h3 className="font-bold text-white text-lg">{mockMatch.awayTeam}</h3>
            <div className="flex justify-center gap-1 mt-2">
              {mockMatch.stats.awayForm.map((result, i) => (
                <span
                  key={i}
                  className={`w-6 h-6 rounded text-xs flex items-center justify-center font-bold ${
                    result === 'W'
                      ? 'bg-green-600 text-white'
                      : result === 'D'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-red-600 text-white'
                  }`}
                >
                  {result}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick odds */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="text-center py-2 rounded-lg bg-gray-800/80">
            <span className="text-xs text-gray-400">1</span>
            <p className="text-lg font-bold text-yellow-400">{mockMatch.odds.home.current}</p>
            <span className="text-xs text-gray-500">
              {mockMatch.odds.home.current < mockMatch.odds.home.opening ? (
                <span className="text-green-400 flex items-center justify-center gap-0.5">
                  <ChevronDown className="w-3 h-3" /> {t('dropping')}
                </span>
              ) : (
                <span className="text-red-400 flex items-center justify-center gap-0.5">
                  <ChevronUp className="w-3 h-3" /> {t('rising')}
                </span>
              )}
            </span>
          </div>
          <div className="text-center py-2 rounded-lg bg-gray-800/80">
            <span className="text-xs text-gray-400">X</span>
            <p className="text-lg font-bold text-yellow-400">{mockMatch.odds.draw.current}</p>
          </div>
          <div className="text-center py-2 rounded-lg bg-gray-800/80">
            <span className="text-xs text-gray-400">2</span>
            <p className="text-lg font-bold text-yellow-400">{mockMatch.odds.away.current}</p>
            <span className="text-xs text-gray-500">
              {mockMatch.odds.away.current > mockMatch.odds.away.opening ? (
                <span className="text-red-400 flex items-center justify-center gap-0.5">
                  <ChevronUp className="w-3 h-3" /> {t('rising')}
                </span>
              ) : (
                <span className="text-green-400 flex items-center justify-center gap-0.5">
                  <ChevronDown className="w-3 h-3" /> {t('dropping')}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium">
          <BarChart3 className="w-4 h-4" />
          {t('analytics')}
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-gray-400 hover:text-white text-sm font-medium transition-colors">
          <Target className="w-4 h-4" />
          {t('predictions')}
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-gray-400 hover:text-white text-sm font-medium transition-colors">
          <Activity className="w-4 h-4" />
          {t('stats')}
        </button>
      </div>

      {/* Odds Comparison Table */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          {t('oddsComparison')}
        </h2>
        <div className="rounded-lg border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                  {t('bookmaker')}
                </th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">1</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">X</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">2</th>
              </tr>
            </thead>
            <tbody>
              {mockMatch.bookmakers.map((bm) => (
                <tr key={bm.name} className="border-t border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-gray-200">{bm.name}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-medium ${
                        bm.home === Math.max(...mockMatch.bookmakers.map((b) => b.home))
                          ? 'text-green-400'
                          : 'text-yellow-400'
                      }`}
                    >
                      {bm.home}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-medium ${
                        bm.draw === Math.max(...mockMatch.bookmakers.map((b) => b.draw))
                          ? 'text-green-400'
                          : 'text-yellow-400'
                      }`}
                    >
                      {bm.draw}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-medium ${
                        bm.away === Math.max(...mockMatch.bookmakers.map((b) => b.away))
                          ? 'text-green-400'
                          : 'text-yellow-400'
                      }`}
                    >
                      {bm.away}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional odds */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 text-center">
            <span className="text-xs text-gray-400">{t('over25')}</span>
            <p className="text-lg font-bold text-yellow-400 mt-1">
              {mockMatch.odds.over25.current}
            </p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 text-center">
            <span className="text-xs text-gray-400">{t('under25')}</span>
            <p className="text-lg font-bold text-yellow-400 mt-1">
              {mockMatch.odds.under25.current}
            </p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 text-center">
            <span className="text-xs text-gray-400">BTTS</span>
            <p className="text-lg font-bold text-yellow-400 mt-1">
              {mockMatch.odds.btts.current}
            </p>
          </div>
        </div>
      </section>

      {/* Head to Head */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          {t('headToHead')}
        </h2>
        <div className="space-y-2">
          {mockMatch.stats.h2h.map((match, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-gray-900/50 border border-gray-800 px-4 py-3"
            >
              <span className="text-xs text-gray-500">{match.date}</span>
              <span className="text-sm text-gray-200">{match.home}</span>
              <span className="text-sm font-bold text-white bg-gray-800 px-3 py-1 rounded">
                {match.score}
              </span>
              <span className="text-sm text-gray-200">{match.away}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Match Stats Comparison */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          {t('seasonStats')}
        </h2>
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 space-y-4">
          {[
            {
              label: t('goalsScored'),
              home: mockMatch.stats.homeStats.goalsScored,
              away: mockMatch.stats.awayStats.goalsScored,
            },
            {
              label: t('goalsConceded'),
              home: mockMatch.stats.homeStats.goalsConceded,
              away: mockMatch.stats.awayStats.goalsConceded,
            },
            {
              label: t('cleanSheets'),
              home: mockMatch.stats.homeStats.cleanSheets,
              away: mockMatch.stats.awayStats.cleanSheets,
            },
            {
              label: t('avgPossession'),
              home: mockMatch.stats.homeStats.possession,
              away: mockMatch.stats.awayStats.possession,
              suffix: '%',
            },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>
                  {stat.home}
                  {stat.suffix || ''}
                </span>
                <span className="font-medium text-gray-300">{stat.label}</span>
                <span>
                  {stat.away}
                  {stat.suffix || ''}
                </span>
              </div>
              <div className="flex gap-1 h-2">
                <div
                  className="bg-blue-500 rounded-l"
                  style={{
                    width: `${(stat.home / (stat.home + stat.away)) * 100}%`,
                  }}
                />
                <div
                  className="bg-red-500 rounded-r"
                  style={{
                    width: `${(stat.away / (stat.home + stat.away)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics Reports */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-yellow-400" />
          {t('analyticsReports')}
        </h2>
        <div className="space-y-3">
          {matchAnalytics.map((report) => (
            <Link
              key={report.id}
              href={`/${locale}/analytics/${report.id}`}
              className="block rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:border-gray-700 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                {report.isPremium && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-medium">
                    Premium
                  </span>
                )}
                <span className="text-xs text-gray-500">{report.author}</span>
              </div>
              <h3 className="font-medium text-white hover:text-blue-300 transition-colors">
                {report.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{report.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* User Predictions */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          {t('userPredictions')} ({matchPredictions.length})
        </h2>
        <div className="space-y-3">
          {matchPredictions.map((pred) => (
            <div
              key={pred.id}
              className="rounded-lg border border-gray-800 bg-gray-900/50 p-4"
            >
              <div className="flex items-center gap-3 mb-3">
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
                  <span className="text-xs text-green-400">{pred.successRate}% {t('successRate')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded bg-blue-500/20 text-blue-300 text-sm font-medium">
                  {pred.prediction}
                </span>
                <span className="text-yellow-400 font-bold">@{pred.odds}</span>
              </div>
              <p className="text-sm text-gray-400">{pred.analysis}</p>
              <div className="mt-3 text-xs text-gray-500">
                {pred.likes} {t('likes')}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
