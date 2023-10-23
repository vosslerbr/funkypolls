import { PollGetResponse } from "../types";
import prisma from "../utils/prismaConnect";

export default async (pollId: string): Promise<any> => {
  const poll = await prisma.poll.findUnique({
    where: {
      id: pollId,
    },
    include: {
      options: true,
    },
  });

  if (!poll) throw new Error("Poll not found");

  return {
    poll,
    // answers,
    links: {
      resultsUrl: `${process.env.BASE_URL}/results/${poll.id.toString()}`,
      voteUrl: `${process.env.BASE_URL}/vote/${poll.id.toString()}`,
    },
  };
};
