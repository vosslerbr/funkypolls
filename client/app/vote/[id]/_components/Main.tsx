"use client";

import { PollWithLinks } from "@/lib/types";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Expired } from "./Expired";
import PasscodeForm from "./PasscodeForm";
import VoteForms from "./VoteForms";

export default function VoteMain({
  pollData,
  passcodeRequiredToView,
}: {
  pollData: PollWithLinks;
  passcodeRequiredToView: boolean;
}) {
  const [validated, setValidated] = useState(false);
  const [expired, setExpired] = useState(false);

  const { id: pollId, expirationDate, name: pollName } = pollData.poll;

  useEffect(() => {
    const isExpired = dayjs(expirationDate).isBefore(dayjs());

    setExpired(isExpired);

    const interval = setInterval(() => {
      const isNowExpired = dayjs(expirationDate).isBefore(dayjs());

      setExpired(isNowExpired);

      if (isNowExpired) {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [expirationDate]);

  // requires passcode and not yet validated
  if (passcodeRequiredToView && !validated) {
    return <PasscodeForm pollId={pollId} setValidated={setValidated} />;
  }

  // poll expired
  if (expired) {
    return <Expired pollId={pollId} pollName={pollName} />;
  }

  // valid, exists, and not expired
  return <VoteForms pollData={pollData} />;
}
