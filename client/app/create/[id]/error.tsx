"use client";

import PageTitle from "@/components/PageTitle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <PageTitle title="Create a FunkyPoll" />
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message || "Something went wrong. Please try again."}</AlertDescription>
      </Alert>
    </>
  );
}
