import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";
import dayjs from "dayjs";

// TODO i think we'll try out https://cron-job.org/en/faq/ for this
export async function POST() {
  const now = dayjs().toDate();

  await prisma.poll.updateMany({
    where: {
      status: Status.OPEN,
      expirationDate: {
        lte: now,
      },
    },
    data: {
      status: Status.EXPIRED,
    },
  });

  // TODO for each poll, alert all websocket connections that the poll has expired

  return Response.json({ message: "cron updated statuses" });
}
