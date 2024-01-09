import PageTitle from "@/components/PageTitle";
import { Metadata } from "next";
import PollResults from "./_components/PollResults";

export const metadata: Metadata = {
  title: "FunkyPolls | Results",
  description: "See the results of a poll.",
};

export default function ResultsPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <>
      <PageTitle title="Results" />
      <PollResults id={id} />
    </>
  );
}
