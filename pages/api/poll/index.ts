import Answer from "@/models/Answer";
import Poll from "@/models/Poll";
import dbConnect from "@/utils/dbConnect";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";

type Body = {
  poll: {
    question: string;
    expirationDate?: Date;
  };
  answers: string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

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

  // TODO update with real URL
  res.status(200).json({
    resultsUrl: `http://localhost:3000/results/${_id.toString()}`,
    voteUrl: `http://localhost:3000/vote/${_id.toString()}`,
  });
}
