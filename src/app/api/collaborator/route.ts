import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      include: {
        _count: {
          select: {
            followers: true,
            subscribers: true,
          },
        },
      },
    });

    if (!user || (user.role !== "COLLABORATOR" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Not a collaborator" }, { status: 403 });
    }

    const activeSubscribers = await prisma.subscription.count({
      where: { collaboratorId: user.id, status: "ACTIVE" },
    });

    const subscriptions = await prisma.subscription.findMany({
      where: { collaboratorId: user.id, status: "ACTIVE" },
    });

    const totalEarnings = subscriptions.reduce((sum, s) => sum + s.amountAZN, 0);
    const platformCommission = totalEarnings * 0.2;
    const netEarnings = totalEarnings - platformCommission;

    return NextResponse.json({
      totalFollowers: user._count.followers,
      paidSubscribers: activeSubscribers,
      totalEarnings,
      platformCommission,
      netEarnings,
      successRate: user.successRate,
      totalPredictions: user.totalPredictions,
      subscriptionPriceAZN: user.subscriptionPriceAZN,
    });
  } catch (error) {
    console.error("Collaborator stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subscriptionPriceAZN, collaboratorBio } = body;

    const user = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: {
        ...(subscriptionPriceAZN !== undefined && { subscriptionPriceAZN }),
        ...(collaboratorBio !== undefined && { collaboratorBio }),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Collaborator update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
