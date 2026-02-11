import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { predictionId, couponPredictionId } = body;

    if (!predictionId && !couponPredictionId) {
      return NextResponse.json(
        { error: "Either predictionId or couponPredictionId is required" },
        { status: 400 }
      );
    }

    if (predictionId && couponPredictionId) {
      return NextResponse.json(
        { error: "Provide only one of predictionId or couponPredictionId" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    if (predictionId) {
      // Check prediction exists
      const prediction = await prisma.prediction.findUnique({
        where: { id: predictionId },
      });
      if (!prediction) {
        return NextResponse.json(
          { error: "Prediction not found" },
          { status: 404 }
        );
      }

      // Check if already liked
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_predictionId: {
            userId,
            predictionId,
          },
        },
      });

      if (existingLike) {
        // Unlike
        await prisma.like.delete({ where: { id: existingLike.id } });
        const count = await prisma.like.count({ where: { predictionId } });
        return NextResponse.json({
          liked: false,
          likeCount: count,
        });
      } else {
        // Like
        await prisma.like.create({
          data: {
            userId,
            predictionId,
          },
        });
        const count = await prisma.like.count({ where: { predictionId } });
        return NextResponse.json({
          liked: true,
          likeCount: count,
        });
      }
    } else {
      // Coupon prediction like
      const coupon = await prisma.couponPrediction.findUnique({
        where: { id: couponPredictionId },
      });
      if (!coupon) {
        return NextResponse.json(
          { error: "Coupon prediction not found" },
          { status: 404 }
        );
      }

      const existingLike = await prisma.like.findUnique({
        where: {
          userId_couponPredictionId: {
            userId,
            couponPredictionId,
          },
        },
      });

      if (existingLike) {
        // Unlike
        await prisma.like.delete({ where: { id: existingLike.id } });
        const count = await prisma.like.count({
          where: { couponPredictionId },
        });
        return NextResponse.json({
          liked: false,
          likeCount: count,
        });
      } else {
        // Like
        await prisma.like.create({
          data: {
            userId,
            couponPredictionId,
          },
        });
        const count = await prisma.like.count({
          where: { couponPredictionId },
        });
        return NextResponse.json({
          liked: true,
          likeCount: count,
        });
      }
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
