import PageTitle from "@/components/PageTitle";
import { Metadata } from "next";
import VoteMain from "./_components/Main";

export const metadata: Metadata = {
  title: "FunkyPolls | Vote",
  description: "Vote on a FunkyPolls poll.",
};

export default function VotePage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <>
      <PageTitle title="Vote" />
      <VoteMain id={id} />
    </>
  );
}
