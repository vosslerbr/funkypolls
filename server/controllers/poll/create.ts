import dayjs from "dayjs";
import { Request, Response } from "express";
import dbConnect from "../../utils/dbConnect";
import Poll from "../../models/Poll";
import Answer from "../../models/Answer";

type Body = {
  poll: {
    question: string;
    expirationDate?: Date;
  };
  answers: string[];
};

export default async function createPoll(req: Request, res: Response) {
  if (!req.body.poll.question) return res.status(400).send("You need to provide a question");
  if (!req.body.answers || !req.body.answers.length)
    return res.status(400).send("You need to provide answers");

  await dbConnect();

  const {
    poll: { question, expirationDate },
    answers,
  } = req.body as Body;

  const poll = new Poll({
    question,
    expirationDate: expirationDate ? new Date(expirationDate) : dayjs().add(1, "month").toDate(),
  });

  const { _id } = await poll.save();

  for (const answerString of answers) {
    const answer = new Answer({
      answer: answerString,
      voteCount: 0,
      poll: _id,
    });

    await answer.save();
  }

  res.status(200).json({
    resultsUrl: `${process.env.BASE_URL}/results/${_id.toString()}`,
    voteUrl: `${process.env.BASE_URL}/vote/${_id.toString()}`,
  });
}
