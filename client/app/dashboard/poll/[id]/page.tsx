import { Loading } from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import { getPollById } from "@/lib/actions";
import { Metadata } from "next";
import { Suspense } from "react";
import Details from "./_components/Details";

export const metadata: Metadata = {
  title: "FunkyPolls | Details",
  description: "FunkyPoll details.",
};

export default async function PollDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const data = await getPollById(id);

  return (
    <>
      <PageTitle title={data.poll.name} />
      <Suspense fallback={<Loading />}>
        <Details data={data} />
      </Suspense>
    </>
  );
}
