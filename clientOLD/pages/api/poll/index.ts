import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import prisma from "@/utils/prismaConnect";
import getPollAndAnswers from "@/helpers/getPollAndAnswers";
import { PollGetResponse } from "@/types";

type Body = {
  poll: {
    question: string;
    expirationDate?: Date;
  };
  options: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PollGetResponse | string>
) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const {
    poll: { question, expirationDate },
    options,
  } = req.body as Body;

  if (!question) return res.status(400).send("You need to provide a question");

  if (!options || !options.length) return res.status(400).send("You need to provide options");

  const poll = await prisma.poll.create({
    data: {
      question,
      expirationDate: expirationDate
        ? dayjs(expirationDate).toISOString()
        : dayjs().add(30, "day").toISOString(),
    },
  });

  for (const option of options) {
    await prisma.option.create({
      data: {
        text: option,
        votes: 0,
        poll: {
          connect: {
            id: poll.id,
          },
        },
      },
    });
  }

  const pollData = await getPollAndAnswers(poll.id);

  res.status(200).json(pollData);
}
