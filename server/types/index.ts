import { IAnswer } from "../models/Answer";
import { IPoll } from "../models/Poll";

export interface PollGetResponse {
  poll: IPoll;
  answers: IAnswer[];
  links: {
    resultsUrl: string;
    voteUrl: string;
  };
}
