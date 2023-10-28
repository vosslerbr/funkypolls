import prisma from "../utils/prismaConnect";
import { PollGetResponse } from "@/types";

export default async (pollId: string): Promise<PollGetResponse> => {
  const poll = await prisma.poll.findUnique({
    where: {
      id: pollId,
    },
    include: {
      options: true,
    },
  });

  if (!poll) throw new Error("Poll not found");

  const data = {
    poll,
    links: {
      resultsUrl: `${process.env.BASE_URL}/results/${poll.id.toString()}`,
      voteUrl: `${process.env.BASE_URL}/vote/${poll.id.toString()}`,
    },
  };

  return data;
};
