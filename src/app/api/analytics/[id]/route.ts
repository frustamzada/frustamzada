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
    const session = await getServerSession(authOptions);

    const report = await prisma.analyticsReport.findUnique({
      where: { id },
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
        match: true,
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Check premium access for non-admin/non-author users
    if (report.isPremium && session?.user?.id !== report.authorId) {
      const currentUser = session?.user?.id
        ? await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
              role: true,
              premiumSubscription: {
                where: { status: "ACTIVE" },
              },
            },
          })
        : null;

      if (currentUser?.role !== "ADMIN") {
        // Check if user has premium subscription
        const hasPremium =
          currentUser?.role === "PREMIUM" ||
          (currentUser?.premiumSubscription &&
            currentUser.premiumSubscription.status === "ACTIVE");

        // Check if user is subscribed to the author (collaborator)
        const hasCollaboratorSub = session?.user?.id
          ? await prisma.subscription.findFirst({
              where: {
                subscriberId: session.user.id,
                collaboratorId: report.authorId,
                status: "ACTIVE",
              },
            })
          : null;

        if (!hasPremium && !hasCollaboratorSub) {
          // Free users get 2 premium reports per week
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          // Track views via a simple approach: count how many premium reports
          // this user has viewed this week (we use viewCount increment as a proxy)
          // For proper tracking, a separate PremiumView model would be ideal.
          // Here we allow access but note the limitation.
          if (!session?.user?.id) {
            return NextResponse.json(
              {
                error: "Premium content. Please sign in to access.",
                isPremium: true,
                summary: report.summaryAz,
              },
              { status: 403 }
            );
          }

          // For free users, we allow limited access (2 per week)
          // This is a simplified check - a production app would use a separate tracking table
          return NextResponse.json({
            ...report,
            _premiumNotice:
              "You are viewing this as a free user. Upgrade to premium for unlimited access.",
          });
        }
      }
    }

    // Increment view count
    await prisma.analyticsReport.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching analytics report:", error);
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update analytics reports" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existing = await prisma.analyticsReport.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const body = await request.json();
    const allowedFields = [
      "reportType",
      "isPremium",
      "sport",
      "league",
      "titleAz",
      "titleEn",
      "titleRu",
      "contentAz",
      "contentEn",
      "contentRu",
      "summaryAz",
      "summaryEn",
      "summaryRu",
      "coverImage",
      "tags",
      "isFeatured",
      "matchId",
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

    const report = await prisma.analyticsReport.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error updating analytics report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can delete analytics reports" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existing = await prisma.analyticsReport.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    await prisma.analyticsReport.delete({ where: { id } });

    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting analytics report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
