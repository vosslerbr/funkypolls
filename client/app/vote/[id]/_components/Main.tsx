"use client";

import { Loading } from "@/components/Loading";
import { checkForPollPassword, getPollById } from "@/lib/actions";
import { PollWithOptions } from "@/lib/helpers.ts/getPollAndAnswers";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Expired } from "./Expired";
import NotFound from "./NotFound";
import PasswordForm from "./PasswordForm";
import VoteForm from "./VoteForm";

export default function VoteMain({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState<PollWithOptions | null>(null);
  const [optionIds, setOptionIds] = useState<string[]>([]);
  const [validated, setValidated] = useState(false);
  const [pollFound, setPollFound] = useState(true);

  const isExpired = poll && dayjs(poll.expirationDate).isBefore(dayjs());

  useEffect(() => {
    async function fetchPoll() {
      try {
        const { passwordRequired, pollFound } = await checkForPollPassword(id);

        if (!pollFound) {
          setPollFound(false);
          return;
        }

        // don't fetch the poll if it requires a password
        if (passwordRequired) return;

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
    return <Loading />;
  }

  // requires password and not validated
  if (pollFound && !validated) {
    return (
      <PasswordForm
        id={id}
        setPoll={setPoll}
        setOptionIds={setOptionIds}
        setValidated={setValidated}
      />
    );
  }

  // poll not found
  if (!pollFound || !poll) {
    return <NotFound />;
  }

  // poll expired
  if (isExpired) {
    return <Expired id={id} poll={poll} />;
  }

  // valid, exists, and not expired
  return <VoteForm id={id} poll={poll} setPoll={setPoll} optionIds={optionIds} />;
}
