import { Schema, Types, model, models } from "mongoose";
import { Answer } from "./Answer";

export interface Poll {
  _id: Types.ObjectId;
  question: string;
  expirationDate: Date;
  answers?: Answer[];
  createdAt: Date;
  updatedAt: Date;
}

const PollSchema = new Schema<Poll>(
  {
    question: String,
    expirationDate: Date,
  },
  {
    timestamps: true,
  }
);

export default models.Poll || model<Poll>("Poll", PollSchema);
