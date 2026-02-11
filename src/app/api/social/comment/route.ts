import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get("predictionId");
    const couponPredictionId = searchParams.get("couponPredictionId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!predictionId && !couponPredictionId) {
      return NextResponse.json(
        { error: "Either predictionId or couponPredictionId is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (predictionId) where.predictionId = predictionId;
    if (couponPredictionId) where.couponPredictionId = couponPredictionId;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
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
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ]);

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
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
    const { predictionId, couponPredictionId, content, language } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: "Comment must be 1000 characters or less" },
        { status: 400 }
      );
    }

    if (!predictionId && !couponPredictionId) {
      return NextResponse.json(
        { error: "Either predictionId or couponPredictionId is required" },
        { status: 400 }
      );
    }

    // Verify the target exists
    if (predictionId) {
      const prediction = await prisma.prediction.findUnique({
        where: { id: predictionId },
      });
      if (!prediction) {
        return NextResponse.json(
          { error: "Prediction not found" },
          { status: 404 }
        );
      }
    }

    if (couponPredictionId) {
      const coupon = await prisma.couponPrediction.findUnique({
        where: { id: couponPredictionId },
      });
      if (!coupon) {
        return NextResponse.json(
          { error: "Coupon prediction not found" },
          { status: 404 }
        );
      }
    }

    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        predictionId: predictionId || null,
        couponPredictionId: couponPredictionId || null,
        content: content.trim(),
        language: language || "az",
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
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
