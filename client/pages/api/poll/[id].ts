import getPollAndAnswers from "@/helpers/getPollAndAnswers";
import { PollGetResponse } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PollGetResponse | string>
) {
  if (req.method !== "GET") return res.status(405).send("Method not allowed");

  const { id } = req.query as { id: string };

  const pollData = await getPollAndAnswers(id);

  res.status(200).json(pollData);
}
