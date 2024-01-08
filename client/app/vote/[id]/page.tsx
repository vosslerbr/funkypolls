"use client";

import { Loading } from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkForPollPassword, getPollById } from "@/lib/actions";
import { PollWithOptions } from "@/lib/helpers.ts/getPollAndAnswers";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Expired } from "./Expired";
import PasswordForm from "./PasswordForm";
import VoteForm from "./VoteForm";

export default function Vote({ params }: { params: { id: string } }) {
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState<PollWithOptions | null>(null);
  const [optionIds, setOptionIds] = useState<string[]>([]);
  const [validated, setValidated] = useState(false);

  const isExpired = poll && dayjs(poll.expirationDate).isBefore(dayjs());

  useEffect(() => {
    async function fetchPoll() {
      try {
        const requiresPassword = await checkForPollPassword(id);

        // don't fetch the poll if it requires a password
        if (requiresPassword) return;

        const data = await getPollById(id);

        setPoll(data.poll);
        setOptionIds(data.poll.options.map((option) => option.id));

        setValidated(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPoll();
  }, [id]);

  if (loading) {
    return (
      <>
        <PageTitle title="Vote" />
        <Loading />
      </>
    );
  }

  // requires password and not validated
  if (!validated) {
    return (
      <>
        <PageTitle title="Vote" />
        <PasswordForm
          id={id}
          setPoll={setPoll}
          setOptionIds={setOptionIds}
          setValidated={setValidated}
        />
      </>
    );
  }

  // poll expired
  if (isExpired) {
    return (
      <>
        <PageTitle title="Vote" />
        <Expired id={id} poll={poll} />
      </>
    );
  }

  // TODO this doesn't work, renders password form instead
  if (!poll) {
    return (
      <>
        <PageTitle title="Vote" />
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error fetching this poll. Please try again.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  // valid and not expired
  return <VoteForm id={id} poll={poll} setPoll={setPoll} optionIds={optionIds} />;
}
