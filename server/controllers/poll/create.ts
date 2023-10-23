import dayjs from "dayjs";
import { Request, Response } from "express";
import prisma from "../../utils/prismaConnect";
import getPollAndAnswers from "../../helpers/getPollAndAnswers";

type Body = {
  poll: {
    question: string;
    expirationDate?: Date;
  };
  options: string[];
};

export default async function createPoll(req: Request, res: Response) {
  try {
    if (!req.body.poll.question) return res.status(400).send("You need to provide a question");

    if (!req.body.options || !req.body.options.length)
      return res.status(400).send("You need to provide options");

    const {
      poll: { question, expirationDate },
      options,
    } = req.body as Body;

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
  } catch (error) {
    console.error("Poll POST error: ", error);

    if (error instanceof Error) return res.status(400).send(error.message);

    return res.status(400).send("Unknown error in Poll POST");
  }
}
