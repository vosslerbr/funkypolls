import ErrorMessage from "@/components/messages/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export function Expired({ pollId, pollName }: { pollId: string; pollName: string }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">{pollName}</h2>
      </CardHeader>

      <CardContent>
        <ErrorMessage
          title="FunkyPoll Expired"
          message="This FunkyPoll has expired and can no longer be voted in. You can still view the results using the button below."
        />
      </CardContent>

      <CardFooter>
        <Link href={`/results/${pollId}`}>
          <Button className="sm:w-auto w-full bg-gradient-to-r from-violet-700 to-purple-500">View Results</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
