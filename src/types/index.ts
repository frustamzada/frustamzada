import { UserRole, Language, PredictionStatus, PredictionType, Sport, BadgeLevel } from "@prisma/client";

export type { UserRole, Language, PredictionStatus, PredictionType, Sport, BadgeLevel };

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  preferredLanguage: Language;
  avatar?: string | null;
}

export interface MatchWithOdds {
  id: string;
  sport: Sport;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo?: string | null;
  awayTeamLogo?: string | null;
  matchDate: string;
  isLive: boolean;
  isFinished: boolean;
  homeScore?: number | null;
  awayScore?: number | null;
  oddsMisliHome?: number | null;
  oddsMisliDraw?: number | null;
  oddsMisliAway?: number | null;
  oddsTopazHome?: number | null;
  oddsTopazDraw?: number | null;
  oddsTopazAway?: number | null;
}

export interface PredictionWithDetails {
  id: string;
  userId: string;
  matchId: string;
  predictionType: PredictionType;
  prediction: string;
  odds?: number | null;
  confidence?: number | null;
  reasoning?: string | null;
  language: Language;
  status: PredictionStatus;
  isPremium: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
    role: UserRole;
    badge: BadgeLevel;
    successRate: number;
  };
  match: MatchWithOdds;
  _count: {
    comments: number;
    likes: number;
  };
  isLiked?: boolean;
}

export interface CouponWithDetails {
  id: string;
  userId: string;
  title: string;
  reasoning?: string | null;
  language: Language;
  totalOdds?: number | null;
  status: PredictionStatus;
  isPremium: boolean;
  confidence?: number | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
    role: UserRole;
    badge: BadgeLevel;
    successRate: number;
  };
  matches: {
    id: string;
    matchId: string;
    predictionType: PredictionType;
    prediction: string;
    odds?: number | null;
    status: PredictionStatus;
    match: MatchWithOdds;
  }[];
  _count: {
    comments: number;
    likes: number;
  };
}

export interface AnalyticsReportSummary {
  id: string;
  reportType: string;
  isPremium: boolean;
  sport?: Sport | null;
  league?: string | null;
  titleAz: string;
  titleEn?: string | null;
  titleRu?: string | null;
  summaryAz?: string | null;
  summaryEn?: string | null;
  summaryRu?: string | null;
  coverImage?: string | null;
  tags: string[];
  viewCount: number;
  isFeatured: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string | null;
    role: UserRole;
  };
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string | null;
  role: UserRole;
  badge: BadgeLevel;
  totalPredictions: number;
  wonPredictions: number;
  lostPredictions: number;
  successRate: number;
}

export interface CollaboratorStats {
  totalFollowers: number;
  paidSubscribers: number;
  totalEarnings: number;
  platformCommission: number;
  netEarnings: number;
  successRate: number;
  totalPredictions: number;
}
