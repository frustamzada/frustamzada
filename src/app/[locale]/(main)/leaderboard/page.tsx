import { getTranslations } from "next-intl/server";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { LeaderboardEntry } from "@/types";

const mockEntries: LeaderboardEntry[] = [
  { id: "1", name: "PredictPro Admin", avatar: null, role: "ADMIN", badge: "MASTER", totalPredictions: 250, wonPredictions: 175, lostPredictions: 75, successRate: 70.0 },
  { id: "2", name: "Rashad Aliyev", avatar: null, role: "COLLABORATOR", badge: "EXPERT", totalPredictions: 320, wonPredictions: 208, lostPredictions: 112, successRate: 65.0 },
  { id: "3", name: "Elvin Mammadov", avatar: null, role: "ADMIN", badge: "EXPERT", totalPredictions: 180, wonPredictions: 120, lostPredictions: 60, successRate: 66.7 },
  { id: "4", name: "Farid Guliyev", avatar: null, role: "PREMIUM", badge: "EXPERT", totalPredictions: 95, wonPredictions: 62, lostPredictions: 33, successRate: 65.3 },
  { id: "5", name: "Aysel Huseynova", avatar: null, role: "FREE", badge: "RISING_STAR", totalPredictions: 45, wonPredictions: 28, lostPredictions: 17, successRate: 62.2 },
  { id: "6", name: "Tural Hasanov", avatar: null, role: "COLLABORATOR", badge: "EXPERT", totalPredictions: 150, wonPredictions: 90, lostPredictions: 60, successRate: 60.0 },
  { id: "7", name: "Nigar Mammadova", avatar: null, role: "PREMIUM", badge: "RISING_STAR", totalPredictions: 80, wonPredictions: 46, lostPredictions: 34, successRate: 57.5 },
  { id: "8", name: "Kamran Aliyev", avatar: null, role: "FREE", badge: "RISING_STAR", totalPredictions: 60, wonPredictions: 33, lostPredictions: 27, successRate: 55.0 },
  { id: "9", name: "Leyla Rzayeva", avatar: null, role: "FREE", badge: "BEGINNER", totalPredictions: 25, wonPredictions: 13, lostPredictions: 12, successRate: 52.0 },
  { id: "10", name: "Orkhan Mammadov", avatar: null, role: "FREE", badge: "BEGINNER", totalPredictions: 30, wonPredictions: 15, lostPredictions: 15, successRate: 50.0 },
];

export default async function LeaderboardPage() {
  const t = await getTranslations("leaderboard");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <LeaderboardTable entries={mockEntries} />
    </div>
  );
}
