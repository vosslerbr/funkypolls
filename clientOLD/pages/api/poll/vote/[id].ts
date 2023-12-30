import getPollAndAnswers from "@/helpers/getPollAndAnswers";
import { PollGetResponse } from "@/types";
import prisma from "@/utils/prismaConnect";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PollGetResponse | string>
) {
  if (req.method !== "PUT") return res.status(405).send("Method not allowed");

  const { id } = req.query as { id: string };
  const { optionId } = req.body as { optionId: string };

  console.log("id", id);
  console.log("optionId", optionId);

  // increment the voteCount for the answer by 1
  await prisma.option.update({
    where: {
      id: optionId,
    },
    data: {
      votes: {
        increment: 1,
      },
    },
  });

  const pollData = await getPollAndAnswers(id);

  // TODO post to socket server
  await axios.post(`http://localhost:8080/api/v1/newvote/${id}`);

  res.status(200).json(pollData);
}
