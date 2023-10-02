import { Request, Response } from "express";
import { PollGetResponse } from "../../types";
import dbConnect from "../../utils/dbConnect";
import Answer, { IAnswer } from "../../models/Answer";
import Poll, { IPoll } from "../../models/Poll";

export default async function getPoll(req: Request, res: Response<PollGetResponse | string>) {
  const { id } = req.params;

  const poll: IPoll | null = await Poll.findById(id);

  if (!poll) return res.status(404).send("Poll not found");

  // Find the answers that match the poll's ID and populate them
  const answers: IAnswer[] = await Answer.find({ poll: poll._id });

  res.status(200).json({
    poll,
    answers,
    links: {
      resultsUrl: `${process.env.BASE_URL}/results/${poll._id.toString()}`,
      voteUrl: `${process.env.BASE_URL}/vote/${poll._id.toString()}`,
    },
  });
}
