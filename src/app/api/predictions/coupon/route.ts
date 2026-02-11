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
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [coupons, total] = await Promise.all([
      prisma.couponPrediction.findMany({
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
          matches: {
            include: {
              match: true,
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
        skip,
        take: limit,
      }),
      prisma.couponPrediction.count({ where }),
    ]);

    return NextResponse.json({
      coupons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching coupon predictions:", error);
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
    const { title, reasoning, language, isPremium, confidence, matches } = body;

    // Validate required fields
    if (!title || !matches || !Array.isArray(matches) || matches.length < 2) {
      return NextResponse.json(
        {
          error:
            "Title and at least 2 matches are required for a coupon prediction",
        },
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

    // Validate each match entry
    for (const m of matches) {
      if (!m.matchId || !m.predictionType || !m.prediction) {
        return NextResponse.json(
          {
            error:
              "Each match must have matchId, predictionType, and prediction",
          },
          { status: 400 }
        );
      }
    }

    // Verify all matches exist and are not finished
    const matchIds = matches.map((m: { matchId: string }) => m.matchId);
    const existingMatches = await prisma.match.findMany({
      where: { id: { in: matchIds } },
      select: { id: true, isFinished: true },
    });

    if (existingMatches.length !== matchIds.length) {
      return NextResponse.json(
        { error: "One or more matches not found" },
        { status: 404 }
      );
    }

    const finishedMatch = existingMatches.find((m) => m.isFinished);
    if (finishedMatch) {
      return NextResponse.json(
        { error: "Cannot include finished matches in a coupon" },
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

    // Calculate totalOdds as product of individual odds
    const totalOdds = matches.reduce(
      (acc: number, m: { odds?: number }) => acc * (m.odds || 1),
      1
    );

    // Create coupon prediction with matches
    const coupon = await prisma.couponPrediction.create({
      data: {
        userId: session.user.id,
        title,
        reasoning,
        language: language || "az",
        isPremium: finalIsPremium,
        confidence,
        totalOdds: parseFloat(totalOdds.toFixed(2)),
        matches: {
          create: matches.map(
            (m: {
              matchId: string;
              predictionType: string;
              prediction: string;
              odds?: number;
            }) => ({
              match: { connect: { id: m.matchId } },
              predictionType: m.predictionType as any,
              prediction: m.prediction,
              odds: m.odds,
            })
          ),
        },
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
        matches: {
          include: {
            match: true,
          },
        },
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error("Error creating coupon prediction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
