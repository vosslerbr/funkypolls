import dayjs from "dayjs";
import { Request, Response } from "express";
import Poll from "../../models/Poll";
import Answer from "../../models/Answer";
import getPollAndAnswers from "../../helpers/getPollAndAnswers";

type Body = {
  poll: {
    question: string;
    expirationDate?: Date;
  };
  answers: string[];
};

export default async function createPoll(req: Request, res: Response) {
  try {
    if (!req.body.poll.question) return res.status(400).send("You need to provide a question");

    if (!req.body.answers || !req.body.answers.length)
      return res.status(400).send("You need to provide answers");

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

    const pollData = await getPollAndAnswers(_id.toString());

    res.status(200).json(pollData);
  } catch (error) {
    console.error("Poll POST error: ", error);

    if (error instanceof Error) return res.status(400).send(error.message);

    return res.status(400).send("Unknown error in Poll POST");
  }
}
