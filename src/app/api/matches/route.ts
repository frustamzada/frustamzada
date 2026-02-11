import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sport = searchParams.get("sport");
    const date = searchParams.get("date");
    const isLive = searchParams.get("isLive");
    const league = searchParams.get("league");

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (sport) where.sport = sport;
    if (league) where.league = { contains: league, mode: "insensitive" };
    if (isLive !== null && isLive !== undefined) {
      where.isLive = isLive === "true";
    }
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.matchDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where,
        include: {
          _count: {
            select: {
              predictions: true,
            },
          },
        },
        orderBy: { matchDate: "asc" },
        skip,
        take: limit,
      }),
      prisma.match.count({ where }),
    ]);

    return NextResponse.json({
      matches,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can create matches" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      sport,
      league,
      homeTeam,
      awayTeam,
      homeTeamLogo,
      awayTeamLogo,
      matchDate,
      venue,
      referee,
      oddsMisliHome,
      oddsMisliDraw,
      oddsMisliAway,
      oddsTopazHome,
      oddsTopazDraw,
      oddsTopazAway,
    } = body;

    // Validate required fields
    if (!sport || !league || !homeTeam || !awayTeam || !matchDate) {
      return NextResponse.json(
        { error: "sport, league, homeTeam, awayTeam, and matchDate are required" },
        { status: 400 }
      );
    }

    const match = await prisma.match.create({
      data: {
        sport,
        league,
        homeTeam,
        awayTeam,
        homeTeamLogo,
        awayTeamLogo,
        matchDate: new Date(matchDate),
        venue,
        referee,
        oddsMisliHome,
        oddsMisliDraw,
        oddsMisliAway,
        oddsTopazHome,
        oddsTopazDraw,
        oddsTopazAway,
      },
    });

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error("Error creating match:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
