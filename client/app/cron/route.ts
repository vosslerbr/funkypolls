import prisma from "@/lib/prisma";
import { Status } from "@prisma/client";
import dayjs from "dayjs";

// TODO i think we'll try out https://cron-job.org/en/faq/ for this
export async function POST() {
  const now = dayjs().toDate();

  // TODO i think we'll need to FIND polls first, then update them all so we can get their IDs for the websocket alert
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

  // TODO for each poll, alert all websocket connections that the poll has expired. We'll need a way to get all the Poll IDs from the action above

  return Response.json({ message: "cron updated statuses" });
}
