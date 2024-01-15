"use client";

import { Loading } from "@/components/Loading";
import { checkForPollPasscode, getPollById } from "@/lib/actions";
import { PollWithOptions } from "@/lib/helpers.ts/getPollAndAnswers";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Expired } from "./Expired";
import NotFound from "./NotFound";
import PasscodeForm from "./PasscodeForm";
import VoteForm from "./VoteForm";

export default function VoteMain({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState<PollWithOptions | null>(null);
  const [optionIds, setOptionIds] = useState<string[]>([]);
  const [validated, setValidated] = useState(false);
  const [pollFound, setPollFound] = useState(true);
  const [nowExpired, setNowExpired] = useState(false);

  const isExpired = poll && dayjs(poll.expirationDate).isBefore(dayjs());

  useEffect(() => {
    async function fetchPoll() {
      try {
        const { requirePasscodeToView, pollFound } = await checkForPollPasscode(id);

        if (!pollFound) {
          setPollFound(false);
          return;
        }

        // don't fetch the poll if it requires a passcode
        if (requirePasscodeToView) return;

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

  useEffect(() => {
    const isExpiredOnFetch = poll !== null && dayjs(poll.expirationDate).isBefore(dayjs());

    setNowExpired(isExpiredOnFetch);

    const interval = setInterval(() => {
      if (poll) {
        const isNowExpired = dayjs(poll.expirationDate).isBefore(dayjs());

        setNowExpired(isNowExpired);

        if (isNowExpired) {
          clearInterval(interval);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [poll]);

  if (loading) {
    return <Loading />;
  }

  // requires passcode and not validated
  // TODO getting a weird flash now when successfully entering a passcode
  if (pollFound && !validated) {
    return (
      <PasscodeForm
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
