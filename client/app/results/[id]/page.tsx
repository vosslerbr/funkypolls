import { Loading } from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import { getPollById } from "@/lib/actions";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "FunkyPolls | Results",
  description: "See the results of a poll.",
};

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const data = await getPollById(id);

  return (
    <>
      <PageTitle title="Results" />
      <Suspense fallback={<Loading />}>{/* <PollResults pollAndLinks={data} /> */}</Suspense>
    </>
  );
}
