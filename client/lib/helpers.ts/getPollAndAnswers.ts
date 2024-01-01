import { Option, Poll } from "@prisma/client";
import prisma from "../prisma";

export interface Links {
  resultsUrl: string;
  voteUrl: string;
}

export type PollWithOptions = Poll & {
  options: Option[];
};

export interface PollAndLinks {
  poll: PollWithOptions;
  links: Links;
}

const getPollAndOptions = async (pollId: string): Promise<PollAndLinks> => {
  const poll = await prisma.poll.findUnique({
    where: {
      id: pollId,
    },
    include: {
      options: true,
    },
  });

  // set password to null so it doesn't get sent to the client
  if (poll) {
    poll.password = null;
  }

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

export default getPollAndOptions;
