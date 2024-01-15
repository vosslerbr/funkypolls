import { Option, Poll } from "@prisma/client";
import prisma from "../prisma";
import { generateLinks } from "../utils";

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

  // set passcode to empty string so it doesn't get sent to the client
  if (poll) {
    poll.passcode = "";
  }

  if (!poll) throw new Error("Poll not found");

  const data = {
    poll,
    links: generateLinks(poll.id),
  };

  return data;
};

export default getPollAndOptions;
