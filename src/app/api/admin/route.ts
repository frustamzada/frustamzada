import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalUsers, activeMatches, totalPredictions, totalSubscriptions] = await Promise.all([
      prisma.user.count(),
      prisma.match.count({ where: { isFinished: false } }),
      prisma.prediction.count(),
      prisma.subscription.findMany({ where: { status: "ACTIVE" } }),
    ]);

    const revenue = totalSubscriptions.reduce((sum, s) => sum + s.amountAZN, 0);

    return NextResponse.json({
      totalUsers,
      activeMatches,
      totalPredictions,
      revenue,
      activeSubscriptions: totalSubscriptions.length,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
