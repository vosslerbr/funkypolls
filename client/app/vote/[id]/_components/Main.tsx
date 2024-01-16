"use client";

import { PollWithOptions } from "@/lib/helpers.ts/getPollAndAnswers";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Expired } from "./Expired";
import PasscodeForm from "./PasscodeForm";
import VoteForm from "./VoteForm";

export default function VoteMain({
  poll,
  passcodeRequiredToView,
}: {
  poll: PollWithOptions;
  passcodeRequiredToView: boolean;
}) {
  const [validated, setValidated] = useState(false);
  const [expired, setExpired] = useState(false);

  const optionIds = poll.options.map((option) => option.id);

  useEffect(() => {
    const isExpired = dayjs(poll.expirationDate).isBefore(dayjs());

    setExpired(isExpired);

    const interval = setInterval(() => {
      const isNowExpired = dayjs(poll.expirationDate).isBefore(dayjs());

      setExpired(isNowExpired);

      if (isNowExpired) {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [poll]);

  // requires passcode and not validated

  if (passcodeRequiredToView && !validated) {
    return <PasscodeForm id={poll.id} setValidated={setValidated} />;
  }

  // poll expired
  if (expired) {
    return <Expired id={poll.id} poll={poll} />;
  }

  // valid, exists, and not expired
  return <VoteForm id={poll.id} poll={poll} optionIds={optionIds} />;
}
