import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const userId = searchParams.get("userId");
    const matchId = searchParams.get("matchId");
    const status = searchParams.get("status");
    const sport = searchParams.get("sport");

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (matchId) where.matchId = matchId;
    if (status) where.status = status;
    if (sport) where.match = { sport };

    const [predictions, total] = await Promise.all([
      prisma.prediction.findMany({
        where,
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
          match: true,
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.prediction.count({ where }),
    ]);

    return NextResponse.json({
      predictions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching predictions:", error);
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

    const body = await request.json();
    const {
      matchId,
      predictionType,
      prediction,
      odds,
      confidence,
      reasoning,
      language,
      isPremium,
    } = body;

    // Validate required fields
    if (!matchId || !predictionType || !prediction) {
      return NextResponse.json(
        { error: "matchId, predictionType, and prediction are required" },
        { status: 400 }
      );
    }

    // Validate confidence range
    if (confidence !== undefined && (confidence < 1 || confidence > 10)) {
      return NextResponse.json(
        { error: "Confidence must be between 1 and 10" },
        { status: 400 }
      );
    }

    // Verify match exists
    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (match.isFinished) {
      return NextResponse.json(
        { error: "Cannot create prediction for a finished match" },
        { status: 400 }
      );
    }

    // Only collaborators/admins can set isPremium
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const canSetPremium =
      user?.role === "COLLABORATOR" || user?.role === "ADMIN";
    const finalIsPremium = canSetPremium ? (isPremium || false) : false;

    // Create prediction and update user stats in a transaction
    const newPrediction = await prisma.$transaction(async (tx) => {
      const created = await tx.prediction.create({
        data: {
          userId: session.user.id,
          matchId,
          predictionType,
          prediction,
          odds,
          confidence,
          reasoning,
          language: language || "az",
          isPremium: finalIsPremium,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              role: true,
              badge: true,
            },
          },
          match: true,
        },
      });

      // Update user's total predictions count
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          totalPredictions: { increment: 1 },
        },
      });

      return created;
    });

    return NextResponse.json(newPrediction, { status: 201 });
  } catch (error) {
    console.error("Error creating prediction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
