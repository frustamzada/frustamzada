import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        predictions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
                badge: true,
                successRate: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likes: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        analyticsReports: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: {
            predictions: true,
            couponMatches: true,
            analyticsReports: true,
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Calculate prediction analytics
    const predictionStats = {
      total: match.predictions.length,
      homeWin: match.predictions.filter((p) => p.prediction === "HOME").length,
      draw: match.predictions.filter((p) => p.prediction === "DRAW").length,
      awayWin: match.predictions.filter((p) => p.prediction === "AWAY").length,
      averageConfidence:
        match.predictions.length > 0
          ? parseFloat(
              (
                match.predictions.reduce(
                  (sum, p) => sum + (p.confidence || 0),
                  0
                ) / match.predictions.length
              ).toFixed(1)
            )
          : 0,
    };

    return NextResponse.json({
      ...match,
      analytics: predictionStats,
    });
  } catch (error) {
    console.error("Error fetching match:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
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
        { error: "Only admins can update matches" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existing = await prisma.match.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    const body = await request.json();
    const allowedFields = [
      "homeScore",
      "awayScore",
      "isLive",
      "isFinished",
      "oddsMisliHome",
      "oddsMisliDraw",
      "oddsMisliAway",
      "oddsTopazHome",
      "oddsTopazDraw",
      "oddsTopazAway",
      "venue",
      "referee",
      "homeTeamLogo",
      "awayTeamLogo",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const match = await prisma.match.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(match);
  } catch (error) {
    console.error("Error updating match:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
