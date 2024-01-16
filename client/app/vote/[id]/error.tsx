"use client";

import PageTitle from "@/components/PageTitle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.log(error);

  return (
    <>
      <PageTitle title="Vote" />
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error.message || "Something went wrong. Please try again."}
        </AlertDescription>
      </Alert>
    </>
  );
}
