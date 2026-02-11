import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";

    if (!q || q.length < 2) {
      return NextResponse.json({ matches: [], users: [], predictions: [] });
    }

    const results: any = {};

    if (type === "all" || type === "matches") {
      results.matches = await prisma.match.findMany({
        where: {
          OR: [
            { homeTeam: { contains: q, mode: "insensitive" } },
            { awayTeam: { contains: q, mode: "insensitive" } },
            { league: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 10,
        orderBy: { matchDate: "desc" },
      });
    }

    if (type === "all" || type === "users") {
      results.users = await prisma.user.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
          badge: true,
          successRate: true,
        },
        take: 10,
      });
    }

    if (type === "all" || type === "predictions") {
      results.predictions = await prisma.prediction.findMany({
        where: {
          OR: [
            { reasoning: { contains: q, mode: "insensitive" } },
            { prediction: { contains: q, mode: "insensitive" } },
          ],
        },
        include: {
          user: { select: { id: true, name: true, avatar: true, role: true, badge: true } },
          match: true,
        },
        take: 10,
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
