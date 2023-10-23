import { Schema, Types, model, models } from "mongoose";
import Poll from "./Poll";

export interface Answer {
  _id: Types.ObjectId;
  answer: string;
  voteCount: number;
  poll: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new Schema<Answer>(
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

export default models.Answer || model<Answer>("Answer", AnswerSchema);
