import { Request, Response } from "express";
import Answer, { IAnswer } from "../../models/Answer";
import Poll, { IPoll } from "../../models/Poll";
import { PollGetResponse } from "../../types";
import dbConnect from "../../utils/dbConnect";

export default async function submitVote(req: Request, res: Response<PollGetResponse | string>) {
  await dbConnect();

  const { id } = req.query;
  const { answerId } = req.body;

  const poll: IPoll | null = await Poll.findById(id);

  if (!poll) return res.status(404).send("Poll not found");

  // increment the voteCount for the answer by 1
  await Answer.updateOne({ _id: answerId }, { $inc: { voteCount: 1 } });

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