import { Loading } from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import { getPollById } from "@/lib/actions";
import { Metadata } from "next";
import { Suspense } from "react";
import CreateForm from "./_components/CreateForm";

export const metadata: Metadata = {
  title: "FunkyPolls | Create",
  description: "Create a new FunkyPoll.",
};

export default async function CreatePollPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const data = await getPollById(id);

  return (
    <>
      <PageTitle title="Create a FunkyPoll" />

      <Suspense fallback={<Loading />}>
        <CreateForm poll={data} />
      </Suspense>
    </>
  );
}
