import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PollWithOptions } from "@/lib/helpers.ts/getPollAndAnswers";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function Expired({ id, poll }: { id: string; poll: PollWithOptions }) {
  return (
    <>
      <h2 className="text-2xl font-bold mt-6">{poll?.question}</h2>

      {/* // TODO this alert is kind of ugly, style it better */}
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>FunkyPoll expired</AlertTitle>
        <AlertDescription>
          This FunkyPoll has expired and can no longer be voted in. You can still view the results
          using the button below.
        </AlertDescription>
      </Alert>
      <Link href={`/results/${id}`} className="mt-4">
        <Button>View Results</Button>
      </Link>
    </>
  );
}
