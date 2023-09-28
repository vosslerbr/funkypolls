import Answer from "@/models/Answer";
import Poll from "@/models/Poll";
import dbConnect from "@/utils/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  await dbConnect();

  const poll = new Poll({
    question: "Who is the best?",
    expirationDate: new Date(),
  });

  const { _id } = await poll.save();

  const answers = ["John Doe", "Jane Doe", "John Smith", "Jane Smith"];

  for (const answerString of answers) {
    const answer = new Answer({
      answer: answerString,
      voteCount: 0,
      poll: _id,
    });

    await answer.save();
  }

  res.status(200).send(`http://localhost:3000/${_id.toString()}`);
}
