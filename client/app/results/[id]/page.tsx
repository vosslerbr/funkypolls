import PageTitle from "@/components/PageTitle";
import { Metadata } from "next";
import PollResults from "./PollResults";

export const metadata: Metadata = {
  title: "FunkyPolls | Results",
  description: "See the results of a poll.",
};

export default function Results({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <>
      <PageTitle title="Results" />
      <PollResults id={id} />
    </>
  );
}
