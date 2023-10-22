import { Types } from "mongoose";

export interface IAnswer {
  _id: Types.ObjectId;
  answer: string;
  voteCount: number;
  poll: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPoll {
  _id: Types.ObjectId;
  question: string;
  expirationDate: Date;
  answers?: IAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PollGetResponse {
  poll: IPoll;
  answers: IAnswer[];
  links: {
    resultsUrl: string;
    voteUrl: string;
  };
}
