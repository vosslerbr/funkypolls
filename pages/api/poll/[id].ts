import Answer, { IAnswer } from "@/models/Answer";
import Poll, { IPoll } from "@/models/Poll";
import dbConnect from "@/utils/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).send("Method Not Allowed");

  await dbConnect();

  const { id } = req.query;

  const poll: IPoll | null = await Poll.findById(id);

  if (!poll) return res.status(404).send("Poll not found");

  // Find the answers that match the poll's ID and populate them
  const answers: IAnswer[] = await Answer.find({ poll: poll._id });

  res.status(200).json({ poll, answers });
}
