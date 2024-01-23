"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Props =
  | { title: string; message: string; error?: never }
  | { error: Error & { digest?: string }; title?: never; message?: never };

export default function ErrorMessage({ error, message = "", title = "" }: Props) {
  // handles generic error (good for use on an error page)
  if (error) {
    return (
      <Alert variant="destructive" className="bg-rose-100 text-rose-600">
        <AlertTitle className="text-lg">Error</AlertTitle>
        <AlertDescription className="text-md">
          {error.message || "Something went wrong. Please try again."}
        </AlertDescription>
      </Alert>
    );
  }

  // handles custom title/message
  return (
    <Alert variant="destructive" className="bg-rose-100 text-rose-600">
      <AlertTitle className="text-lg">{title}</AlertTitle>
      <AlertDescription className="text-md">{message}</AlertDescription>
    </Alert>
  );
}
