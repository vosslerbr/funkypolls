import { Request, Response } from "express";
import { PollGetResponse } from "../../types";
import getPollAndAnswers from "../../helpers/getPollAndAnswers";

export default async function getPoll(req: Request, res: Response<PollGetResponse | string>) {
  try {
    const { id } = req.params;

    const pollData = await getPollAndAnswers(id);

    res.status(200).json(pollData);
  } catch (error) {
    console.error("Poll GET error: ", error);

    if (error instanceof Error) return res.status(400).send(error.message);

    return res.status(400).send("Unknown error in Poll GET");
  }
}
