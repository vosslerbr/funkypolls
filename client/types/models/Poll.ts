import { Schema, Types, model, models } from "mongoose";
import { IAnswer } from "./Answer";

export interface IPoll {
  _id: Types.ObjectId;
  question: string;
  expirationDate: Date;
  answers?: IAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

const PollSchema = new Schema<IPoll>(
  {
    question: String,
    expirationDate: Date,
  },
  {
    timestamps: true,
  }
);

export default models.Poll || model<IPoll>("Poll", PollSchema);
