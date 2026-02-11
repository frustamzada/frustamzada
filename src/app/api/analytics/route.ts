import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const reportType = searchParams.get("reportType");
    const sport = searchParams.get("sport");
    const isFeatured = searchParams.get("isFeatured");
    const isPremium = searchParams.get("isPremium");

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (reportType) where.reportType = reportType;
    if (sport) where.sport = sport;
    if (isFeatured !== null && isFeatured !== undefined) {
      where.isFeatured = isFeatured === "true";
    }
    if (isPremium !== null && isPremium !== undefined) {
      where.isPremium = isPremium === "true";
    }

    const [reports, total] = await Promise.all([
      prisma.analyticsReport.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
              role: true,
              badge: true,
            },
          },
          match: {
            select: {
              id: true,
              homeTeam: true,
              awayTeam: true,
              matchDate: true,
              sport: true,
              league: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.analyticsReport.count({ where }),
    ]);

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching analytics reports:", error);
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

    // Check admin/collaborator role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN" && user?.role !== "COLLABORATOR") {
      return NextResponse.json(
        { error: "Only admins and collaborators can create analytics reports" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      matchId,
      reportType,
      isPremium,
      sport,
      league,
      titleAz,
      titleEn,
      titleRu,
      contentAz,
      contentEn,
      contentRu,
      summaryAz,
      summaryEn,
      summaryRu,
      coverImage,
      tags,
      isFeatured,
    } = body;

    // Validate required fields
    if (!reportType || !titleAz || !contentAz) {
      return NextResponse.json(
        { error: "reportType, titleAz, and contentAz are required" },
        { status: 400 }
      );
    }

    // Only admins can set isFeatured
    const finalIsFeatured =
      user?.role === "ADMIN" ? (isFeatured || false) : false;

    // Verify match exists if matchId provided
    if (matchId) {
      const match = await prisma.match.findUnique({ where: { id: matchId } });
      if (!match) {
        return NextResponse.json(
          { error: "Match not found" },
          { status: 404 }
        );
      }
    }

    const report = await prisma.analyticsReport.create({
      data: {
        authorId: session.user.id,
        matchId,
        reportType,
        isPremium: isPremium || false,
        sport,
        league,
        titleAz,
        titleEn,
        titleRu,
        contentAz,
        contentEn,
        contentRu,
        summaryAz,
        summaryEn,
        summaryRu,
        coverImage,
        tags: tags || [],
        isFeatured: finalIsFeatured,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
        match: true,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating analytics report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
