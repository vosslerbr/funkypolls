import { Option, Poll } from "@prisma/client";

export type PollGetResponse = {
  poll: Poll & { options: Option[] };
  links: { resultsUrl: string; voteUrl: string };
};
