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

    const prediction = await prisma.prediction.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            badge: true,
            successRate: true,
            totalPredictions: true,
            wonPredictions: true,
          },
        },
        match: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!prediction) {
      return NextResponse.json(
        { error: "Prediction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(prediction);
  } catch (error) {
    console.error("Error fetching prediction:", error);
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

    const { id } = await params;

    // Check admin role
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update prediction status" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !["PENDING", "WON", "LOST", "VOID"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be PENDING, WON, LOST, or VOID" },
        { status: 400 }
      );
    }

    // Get the current prediction
    const existing = await prisma.prediction.findUnique({
      where: { id },
      select: { status: true, userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Prediction not found" },
        { status: 404 }
      );
    }

    // Update prediction and user stats in a transaction
    const updated = await prisma.$transaction(async (tx) => {
      const updatedPrediction = await tx.prediction.update({
        where: { id },
        data: { status },
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
          match: true,
        },
      });

      // Update user stats when transitioning to WON or LOST
      if (
        existing.status === "PENDING" &&
        (status === "WON" || status === "LOST")
      ) {
        const updateData: Record<string, unknown> =
          status === "WON"
            ? { wonPredictions: { increment: 1 } }
            : { lostPredictions: { increment: 1 } };

        await tx.user.update({
          where: { id: existing.userId },
          data: updateData,
        });

        // Recalculate success rate
        const user = await tx.user.findUnique({
          where: { id: existing.userId },
          select: { wonPredictions: true, lostPredictions: true },
        });

        if (user) {
          const totalResolved = user.wonPredictions + user.lostPredictions;
          const successRate =
            totalResolved > 0
              ? parseFloat(
                  ((user.wonPredictions / totalResolved) * 100).toFixed(2)
                )
              : 0;

          await tx.user.update({
            where: { id: existing.userId },
            data: { successRate },
          });
        }
      }

      // Handle reversal: if moving from WON/LOST back to something else
      if (existing.status === "WON" && status !== "WON") {
        await tx.user.update({
          where: { id: existing.userId },
          data: { wonPredictions: { decrement: 1 } },
        });
      }
      if (existing.status === "LOST" && status !== "LOST") {
        await tx.user.update({
          where: { id: existing.userId },
          data: { lostPredictions: { decrement: 1 } },
        });
      }

      // Recalculate success rate after reversal
      if (
        (existing.status === "WON" || existing.status === "LOST") &&
        status !== existing.status
      ) {
        const user = await tx.user.findUnique({
          where: { id: existing.userId },
          select: { wonPredictions: true, lostPredictions: true },
        });
        if (user) {
          const totalResolved = user.wonPredictions + user.lostPredictions;
          const successRate =
            totalResolved > 0
              ? parseFloat(
                  ((user.wonPredictions / totalResolved) * 100).toFixed(2)
                )
              : 0;
          await tx.user.update({
            where: { id: existing.userId },
            data: { successRate },
          });
        }
      }

      return updatedPrediction;
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating prediction:", error);
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

    const { id } = await params;

    const prediction = await prisma.prediction.findUnique({
      where: { id },
      select: { userId: true, status: true },
    });

    if (!prediction) {
      return NextResponse.json(
        { error: "Prediction not found" },
        { status: 404 }
      );
    }

    // Check ownership (admins can also delete)
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (
      prediction.userId !== session.user.id &&
      currentUser?.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "You can only delete your own predictions" },
        { status: 403 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.prediction.delete({ where: { id } });

      // Decrement user's total predictions
      await tx.user.update({
        where: { id: prediction.userId },
        data: {
          totalPredictions: { decrement: 1 },
          ...(prediction.status === "WON"
            ? { wonPredictions: { decrement: 1 } }
            : {}),
          ...(prediction.status === "LOST"
            ? { lostPredictions: { decrement: 1 } }
            : {}),
        },
      });

      // Recalculate success rate
      const user = await tx.user.findUnique({
        where: { id: prediction.userId },
        select: { wonPredictions: true, lostPredictions: true },
      });
      if (user) {
        const totalResolved = user.wonPredictions + user.lostPredictions;
        const successRate =
          totalResolved > 0
            ? parseFloat(
                ((user.wonPredictions / totalResolved) * 100).toFixed(2)
              )
            : 0;
        await tx.user.update({
          where: { id: prediction.userId },
          data: { successRate },
        });
      }
    });

    return NextResponse.json({ message: "Prediction deleted successfully" });
  } catch (error) {
    console.error("Error deleting prediction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
