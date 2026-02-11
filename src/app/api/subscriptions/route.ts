import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [collaboratorSubs, premiumSub] = await Promise.all([
      prisma.subscription.findMany({
        where: { subscriberId: session.user.id },
        include: {
          collaborator: {
            select: {
              id: true,
              name: true,
              avatar: true,
              role: true,
              badge: true,
              successRate: true,
              subscriptionPriceAZN: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.premiumSubscription.findFirst({
        where: { userId: session.user.id },
      }),
    ]);

    return NextResponse.json({
      collaboratorSubscriptions: collaboratorSubs,
      premiumSubscription: premiumSub,
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
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
    const { collaboratorId, amountAZN, type } = body;

    if (!amountAZN || amountAZN <= 0) {
      return NextResponse.json(
        { error: "Valid amountAZN is required" },
        { status: 400 }
      );
    }

    // Premium subscription
    if (type === "premium") {
      // Check if already has active premium subscription
      const existingPremium = await prisma.premiumSubscription.findFirst({
        where: {
          userId: session.user.id,
          status: "ACTIVE",
        },
      });

      if (existingPremium) {
        return NextResponse.json(
          { error: "You already have an active premium subscription" },
          { status: 409 }
        );
      }

      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const [premiumSub] = await prisma.$transaction([
        prisma.premiumSubscription.create({
          data: {
            userId: session.user.id,
            amountAZN,
            endDate,
          },
        }),
        prisma.user.update({
          where: { id: session.user.id },
          data: { role: "PREMIUM" },
        }),
      ]);

      return NextResponse.json(premiumSub, { status: 201 });
    }

    // Collaborator subscription
    if (!collaboratorId) {
      return NextResponse.json(
        { error: "collaboratorId is required for collaborator subscriptions" },
        { status: 400 }
      );
    }

    if (collaboratorId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot subscribe to yourself" },
        { status: 400 }
      );
    }

    // Verify collaborator exists and has COLLABORATOR role
    const collaborator = await prisma.user.findUnique({
      where: { id: collaboratorId },
      select: {
        role: true,
        platformCommissionRate: true,
        subscriptionPriceAZN: true,
      },
    });

    if (!collaborator || collaborator.role !== "COLLABORATOR") {
      return NextResponse.json(
        { error: "Collaborator not found" },
        { status: 404 }
      );
    }

    // Check for existing active subscription
    const existingSub = await prisma.subscription.findFirst({
      where: {
        subscriberId: session.user.id,
        collaboratorId,
        status: "ACTIVE",
      },
    });

    if (existingSub) {
      return NextResponse.json(
        { error: "You already have an active subscription to this collaborator" },
        { status: 409 }
      );
    }

    const platformFeeAZN = parseFloat(
      (amountAZN * collaborator.platformCommissionRate).toFixed(2)
    );
    const collaboratorEarning = parseFloat(
      (amountAZN - platformFeeAZN).toFixed(2)
    );

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const [subscription] = await prisma.$transaction([
      prisma.subscription.create({
        data: {
          subscriberId: session.user.id,
          collaboratorId,
          amountAZN,
          platformFeeAZN,
          endDate,
        },
        include: {
          collaborator: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.user.update({
        where: { id: collaboratorId },
        data: {
          totalEarningsAZN: { increment: collaboratorEarning },
        },
      }),
    ]);

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subscriptionId } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "subscriptionId is required" },
        { status: 400 }
      );
    }

    // Try collaborator subscription first
    const colSub = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (colSub) {
      if (colSub.subscriberId !== session.user.id) {
        return NextResponse.json(
          { error: "You can only cancel your own subscriptions" },
          { status: 403 }
        );
      }

      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: { status: "CANCELLED" },
      });

      return NextResponse.json({ message: "Subscription cancelled" });
    }

    // Try premium subscription
    const premSub = await prisma.premiumSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (premSub) {
      if (premSub.userId !== session.user.id) {
        return NextResponse.json(
          { error: "You can only cancel your own subscriptions" },
          { status: 403 }
        );
      }

      await prisma.$transaction([
        prisma.premiumSubscription.update({
          where: { id: subscriptionId },
          data: { status: "CANCELLED" },
        }),
        prisma.user.update({
          where: { id: session.user.id },
          data: { role: "FREE" },
        }),
      ]);

      return NextResponse.json({ message: "Premium subscription cancelled" });
    }

    return NextResponse.json(
      { error: "Subscription not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
