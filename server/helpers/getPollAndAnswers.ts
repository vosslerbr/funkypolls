import Answer, { IAnswer } from "../models/Answer";
import Poll, { IPoll } from "../models/Poll";
import { PollGetResponse } from "../types";

export default async (pollId: string): Promise<PollGetResponse> => {
  const poll: IPoll | null = await Poll.findById(pollId);

  if (!poll) throw new Error("Poll not found");

  // Find the answers that match the poll's ID and populate them
  const answers: IAnswer[] = await Answer.find({ poll: poll._id });

  return {
    poll,
    answers,
    links: {
      resultsUrl: `${process.env.BASE_URL}/results/${poll._id.toString()}`,
      voteUrl: `${process.env.BASE_URL}/vote/${poll._id.toString()}`,
    },
  };
};
