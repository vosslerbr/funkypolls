import { Loading } from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import { getPollById } from "@/lib/actions";
import { Metadata } from "next";
import { Suspense } from "react";
import CreateQuestionForm from "./_components/CreateQuestionForm";

export const metadata: Metadata = {
  title: "FunkyPolls | Create",
  description: "Create a new FunkyPoll.",
};

export default async function CreatePollPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const data = await getPollById(id);

  return (
    <>
      <PageTitle title="Create a Question" />

      <Suspense fallback={<Loading />}>
        <CreateQuestionForm data={data} />
      </Suspense>
    </>
  );
}
