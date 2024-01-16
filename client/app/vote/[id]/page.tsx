import { Loading } from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import { checkForPollPasscode, getPollById } from "@/lib/actions";
import { Metadata } from "next";
import { Suspense } from "react";
import VoteMain from "./_components/Main";

export const metadata: Metadata = {
  title: "FunkyPolls | Vote",
  description: "Vote on a FunkyPolls poll.",
};

export default async function VotePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const data = await getPollById(id);
  const { requirePasscodeToView } = await checkForPollPasscode(data.poll.id);

  return (
    <>
      <PageTitle title="Vote" />
      <Suspense fallback={<Loading />}>
        <VoteMain poll={data.poll} passcodeRequiredToView={requirePasscodeToView} />
      </Suspense>
    </>
  );
}
