import { Schema, Types, model, models } from "mongoose";
import Poll from "./Poll";

export interface IAnswer {
  _id: Types.ObjectId;
  answer: string;
  voteCount: number;
  poll: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>(
  {
    answer: String,
    voteCount: Number,
    poll: {
      type: Schema.Types.ObjectId,
      ref: Poll,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Answer || model<IAnswer>("Answer", AnswerSchema);
