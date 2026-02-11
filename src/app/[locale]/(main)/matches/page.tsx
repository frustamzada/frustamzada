import { getTranslations } from 'next-intl/server';
import {
  Radio,
  Calendar,
  CalendarDays,
  Filter,
  Clock,
  ArrowRight,
} from 'lucide-react';

const mockMatches = {
  live: [
    {
      id: 'match-1',
      homeTeam: 'Qarabağ FK',
      awayTeam: 'Neftçi PFK',
      homeScore: 2,
      awayScore: 1,
      minute: 67,
      league: 'Azərbaycan Premyer Liqası',
      sport: 'football',
      homeOdds: 1.25,
      drawOdds: 5.5,
      awayOdds: 9.0,
      homeLogo: '/teams/qarabag.png',
      awayLogo: '/teams/neftchi.png',
    },
    {
      id: 'match-2',
      homeTeam: 'Arsenal',
      awayTeam: 'Manchester City',
      homeScore: 1,
      awayScore: 1,
      minute: 34,
      league: 'Premier League',
      sport: 'football',
      homeOdds: 2.1,
      drawOdds: 3.4,
      awayOdds: 3.2,
      homeLogo: '/teams/arsenal.png',
      awayLogo: '/teams/mancity.png',
    },
  ],
  today: [
    {
      id: 'match-3',
      homeTeam: 'Zirə FK',
      awayTeam: 'Sabah FK',
      kickoff: '18:00',
      league: 'Azərbaycan Premyer Liqası',
      sport: 'football',
      homeOdds: 2.45,
      drawOdds: 3.1,
      awayOdds: 2.9,
      homeLogo: '/teams/zira.png',
      awayLogo: '/teams/sabah.png',
    },
    {
      id: 'match-4',
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      kickoff: '21:00',
      league: 'La Liga',
      sport: 'football',
      homeOdds: 2.2,
      drawOdds: 3.5,
      awayOdds: 3.0,
      homeLogo: '/teams/realmadrid.png',
      awayLogo: '/teams/barcelona.png',
    },
    {
      id: 'match-5',
      homeTeam: 'Liverpool',
      awayTeam: 'Chelsea',
      kickoff: '17:30',
      league: 'Premier League',
      sport: 'football',
      homeOdds: 1.65,
      drawOdds: 3.8,
      awayOdds: 5.0,
      homeLogo: '/teams/liverpool.png',
      awayLogo: '/teams/chelsea.png',
    },
    {
      id: 'match-6',
      homeTeam: 'Juventus',
      awayTeam: 'AC Milan',
      kickoff: '20:45',
      league: 'Serie A',
      sport: 'football',
      homeOdds: 2.0,
      drawOdds: 3.3,
      awayOdds: 3.6,
      homeLogo: '/teams/juventus.png',
      awayLogo: '/teams/acmilan.png',
    },
  ],
  tomorrow: [
    {
      id: 'match-7',
      homeTeam: 'Qarabağ FK',
      awayTeam: 'Zirə FK',
      kickoff: '19:00',
      league: 'Azərbaycan Premyer Liqası',
      sport: 'football',
      homeOdds: 1.45,
      drawOdds: 4.2,
      awayOdds: 6.5,
      homeLogo: '/teams/qarabag.png',
      awayLogo: '/teams/zira.png',
    },
    {
      id: 'match-8',
      homeTeam: 'PSG',
      awayTeam: 'Bayern Munich',
      kickoff: '21:00',
      league: 'Champions League',
      sport: 'football',
      homeOdds: 2.3,
      drawOdds: 3.4,
      awayOdds: 2.9,
      homeLogo: '/teams/psg.png',
      awayLogo: '/teams/bayern.png',
    },
    {
      id: 'match-9',
      homeTeam: 'Dortmund',
      awayTeam: 'Atletico Madrid',
      kickoff: '21:00',
      league: 'Champions League',
      sport: 'football',
      homeOdds: 2.5,
      drawOdds: 3.3,
      awayOdds: 2.75,
      homeLogo: '/teams/dortmund.png',
      awayLogo: '/teams/atletico.png',
    },
  ],
};

const sportFilters = [
  { key: 'all', icon: '🏆' },
  { key: 'football', icon: '⚽' },
  { key: 'basketball', icon: '🏀' },
  { key: 'tennis', icon: '🎾' },
];

export default async function MatchesPage() {
  const t = await getTranslations('matches');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{t('title')}</h1>

      {/* Tab filters */}
      <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1">
        <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium">
          <Radio className="w-4 h-4 animate-pulse" />
          {t('live')}
          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {mockMatches.live.length}
          </span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-400 hover:text-white text-sm font-medium transition-colors">
          <Calendar className="w-4 h-4" />
          {t('today')}
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-400 hover:text-white text-sm font-medium transition-colors">
          <CalendarDays className="w-4 h-4" />
          {t('tomorrow')}
        </button>
      </div>

      {/* Sport filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        {sportFilters.map((sport) => (
          <button
            key={sport.key}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              sport.key === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span className="mr-1">{sport.icon}</span>
            {t(`sports.${sport.key}`)}
          </button>
        ))}
      </div>

      {/* Live Matches */}
      <section>
        <h2 className="text-lg font-semibold text-red-400 flex items-center gap-2 mb-3">
          <Radio className="w-4 h-4 animate-pulse" />
          {t('liveNow')}
        </h2>
        <div className="space-y-3">
          {mockMatches.live.map((match) => (
            <a
              key={match.id}
              href={`matches/${match.id}`}
              className="block rounded-lg border border-red-500/20 bg-gray-900/80 p-4 hover:border-red-500/40 transition-all group"
            >
              <div className="text-xs text-gray-400 mb-2">{match.league}</div>
              <div className="flex items-center justify-between">
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <span className="font-medium text-white">
                      {match.homeTeam}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                      {match.homeTeam[0]}
                    </div>
                  </div>
                </div>
                <div className="px-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {match.homeScore} - {match.awayScore}
                  </div>
                  <div className="text-xs text-red-400 font-medium mt-1">
                    {match.minute}&apos;
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                      {match.awayTeam[0]}
                    </div>
                    <span className="font-medium text-white">
                      {match.awayTeam}
                    </span>
                  </div>
                </div>
              </div>
              {/* Odds */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="text-center py-1.5 rounded bg-gray-800 text-sm">
                  <span className="text-gray-400 text-xs">1</span>
                  <span className="ml-1 text-yellow-400 font-medium">
                    {match.homeOdds}
                  </span>
                </div>
                <div className="text-center py-1.5 rounded bg-gray-800 text-sm">
                  <span className="text-gray-400 text-xs">X</span>
                  <span className="ml-1 text-yellow-400 font-medium">
                    {match.drawOdds}
                  </span>
                </div>
                <div className="text-center py-1.5 rounded bg-gray-800 text-sm">
                  <span className="text-gray-400 text-xs">2</span>
                  <span className="ml-1 text-yellow-400 font-medium">
                    {match.awayOdds}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-right">
                <span className="text-xs text-blue-400 group-hover:text-blue-300 flex items-center justify-end gap-1">
                  {t('viewDetails')} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Today's Matches */}
      <section>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-blue-400" />
          {t('todayMatches')}
        </h2>
        <div className="space-y-3">
          {mockMatches.today.map((match) => (
            <a
              key={match.id}
              href={`matches/${match.id}`}
              className="block rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:border-gray-700 transition-all group"
            >
              <div className="text-xs text-gray-400 mb-2">{match.league}</div>
              <div className="flex items-center justify-between">
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <span className="font-medium text-white">
                      {match.homeTeam}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                      {match.homeTeam[0]}
                    </div>
                  </div>
                </div>
                <div className="px-4 text-center">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-sm font-medium">{match.kickoff}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                      {match.awayTeam[0]}
                    </div>
                    <span className="font-medium text-white">
                      {match.awayTeam}
                    </span>
                  </div>
                </div>
              </div>
              {/* Odds */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="text-center py-1.5 rounded bg-gray-800 text-sm">
                  <span className="text-gray-400 text-xs">1</span>
                  <span className="ml-1 text-yellow-400 font-medium">
                    {match.homeOdds}
                  </span>
                </div>
                <div className="text-center py-1.5 rounded bg-gray-800 text-sm">
                  <span className="text-gray-400 text-xs">X</span>
                  <span className="ml-1 text-yellow-400 font-medium">
                    {match.drawOdds}
                  </span>
                </div>
                <div className="text-center py-1.5 rounded bg-gray-800 text-sm">
                  <span className="text-gray-400 text-xs">2</span>
                  <span className="ml-1 text-yellow-400 font-medium">
                    {match.awayOdds}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-right">
                <span className="text-xs text-blue-400 group-hover:text-blue-300 flex items-center justify-end gap-1">
                  {t('viewDetails')} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Tomorrow's Matches */}
      <section>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
          <CalendarDays className="w-4 h-4 text-purple-400" />
          {t('tomorrowMatches')}
        </h2>
        <div className="space-y-3">
          {mockMatches.tomorrow.map((match) => (
            <a
              key={match.id}
              href={`matches/${match.id}`}
              className="block rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:border-gray-700 transition-all group"
            >
              <div className="text-xs text-gray-400 mb-2">{match.league}</div>
              <div className="flex items-center justify-between">
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <span className="font-medium text-white">
                      {match.homeTeam}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                      {match.homeTeam[0]}
                    </div>
                  </div>
                </div>
                <div className="px-4 text-center">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-sm font-medium">{match.kickoff}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                      {match.awayTeam[0]}
                    </div>
                    <span className="font-medium text-white">
                      {match.awayTeam}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="text-center py-1.5 rounded bg-gray-800 text-sm">
                  <span className="text-gray-400 text-xs">1</span>
                  <span className="ml-1 text-yellow-400 font-medium">
                    {match.homeOdds}
                  </span>
                </div>
                <div className="text-center py-1.5 rounded bg-gray-800 text-sm">
                  <span className="text-gray-400 text-xs">X</span>
                  <span className="ml-1 text-yellow-400 font-medium">
                    {match.drawOdds}
                  </span>
                </div>
                <div className="text-center py-1.5 rounded bg-gray-800 text-sm">
                  <span className="text-gray-400 text-xs">2</span>
                  <span className="ml-1 text-yellow-400 font-medium">
                    {match.awayOdds}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-right">
                <span className="text-xs text-blue-400 group-hover:text-blue-300 flex items-center justify-end gap-1">
                  {t('viewDetails')} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
