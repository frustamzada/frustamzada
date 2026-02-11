import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {
      totalPredictions: { gte: 5 },
    };

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        avatar: true,
        role: true,
        badge: true,
        totalPredictions: true,
        wonPredictions: true,
        lostPredictions: true,
        successRate: true,
      },
      orderBy: { successRate: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.user.count({ where });

    return NextResponse.json({
      entries: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
