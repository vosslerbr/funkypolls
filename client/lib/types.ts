import { Poll, Prisma } from "@prisma/client";

type PollGet = Poll &
  Prisma.PollGetPayload<{
    include: {
      questions: {
        include: {
          options: true;
        };
      };
    };
  }>;

export interface Links {
  resultsUrl: string;
  voteUrl: string;
}

export type PollWithLinks = {
  poll: PollGet;
  links: Links;
};

export type PollWithoutLinks = PollGet;
