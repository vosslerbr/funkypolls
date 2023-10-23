import { Answer } from "../models/Answer";
import { Poll } from "../models/Poll";

export interface PollGetResponse {
  poll: Poll;
  answers: Answer[];
  links: {
    resultsUrl: string;
    voteUrl: string;
  };
}
