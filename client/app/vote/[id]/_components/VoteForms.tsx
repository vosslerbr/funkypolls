import { PollWithLinks } from "@/lib/types";
import { Type } from "@prisma/client";
import SingleSelectForm from "./SingleSelectForm";

export default function VoteForms({ pollData }: { pollData: PollWithLinks }) {
  const { questions } = pollData.poll;

  return (
    <>
      {questions.map((question) => {
        switch (question.type) {
          case Type.SINGLE_SELECT:
            return <SingleSelectForm question={question} key={question.id} />;
          default:
            return <p>Question type {question.type} not yet supported</p>;
        }
      })}
    </>
  );
}
