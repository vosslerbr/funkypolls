"use client";

import PageTitle from "@/components/PageTitle";
import ErrorMessage from "@/components/messages/ErrorMessage";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <PageTitle title="Vote" />
      <ErrorMessage error={error} />
    </>
  );
}
