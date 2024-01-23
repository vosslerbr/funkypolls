"use client";

import PageTitle from "@/components/PageTitle";
import ErrorMessage from "@/components/messages/ErrorMessage";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <PageTitle title="Results" />
      <ErrorMessage error={error} />
    </>
  );
}
