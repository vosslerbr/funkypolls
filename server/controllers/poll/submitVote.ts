import { Request, Response } from "express";
import { io } from "../../app";
import getPollAndAnswers from "../../helpers/getPollAndAnswers";
import Answer from "../../models/Answer";
import { PollGetResponse } from "../../types";

export default async function submitVote(req: Request, res: Response<PollGetResponse | string>) {
  try {
    const { id } = req.params;
    const { answerId } = req.body;

    // increment the voteCount for the answer by 1
    await Answer.updateOne({ _id: answerId }, { $inc: { voteCount: 1 } });

    const pollData = await getPollAndAnswers(id);

    // attempt to emit the new vote to the poll room
    try {
      io.to(id).emit("newvote", pollData);
    } catch (error) {
      console.error(error);
    }

    res.status(200).json(pollData);
  } catch (error) {
    console.error("Poll PUT error: ", error);

    if (error instanceof Error) return res.status(400).send(error.message);

    return res.status(400).send("Unknown error in Poll PUT");
  }
}
