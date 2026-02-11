import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type") || "followers";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    if (type === "followers") {
      const [followers, total] = await Promise.all([
        prisma.follow.findMany({
          where: { followingId: userId },
          include: {
            follower: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
                badge: true,
                successRate: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.follow.count({ where: { followingId: userId } }),
      ]);

      return NextResponse.json({
        users: followers.map((f) => f.follower),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } else if (type === "following") {
      const [following, total] = await Promise.all([
        prisma.follow.findMany({
          where: { followerId: userId },
          include: {
            following: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
                badge: true,
                successRate: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.follow.count({ where: { followerId: userId } }),
      ]);

      return NextResponse.json({
        users: following.map((f) => f.following),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } else {
      return NextResponse.json(
        { error: "type must be 'followers' or 'following'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error fetching follow list:", error);
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
    const { followingId } = body;

    if (!followingId) {
      return NextResponse.json(
        { error: "followingId is required" },
        { status: 400 }
      );
    }

    if (followingId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: followingId },
    });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({ where: { id: existingFollow.id } });
      const followerCount = await prisma.follow.count({
        where: { followingId },
      });
      return NextResponse.json({
        following: false,
        followerCount,
      });
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: session.user.id,
          followingId,
        },
      });
      const followerCount = await prisma.follow.count({
        where: { followingId },
      });
      return NextResponse.json({
        following: true,
        followerCount,
      });
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
