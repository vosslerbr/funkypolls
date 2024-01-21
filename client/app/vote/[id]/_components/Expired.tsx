import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function Expired({ pollId, pollName }: { pollId: string; pollName: string }) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold">{pollName}</h2>
      </CardHeader>

      <CardContent>
        {/* // TODO this alert is kind of ugly, style it better. Also refactor to use in error pages */}
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>FunkyPoll expired</AlertTitle>
          <AlertDescription>
            This FunkyPoll has expired and can no longer be voted in. You can still view the results using the button
            below.
          </AlertDescription>
        </Alert>
      </CardContent>

      <CardFooter>
        <Link href={`/results/${pollId}`}>
          <Button className="sm:w-auto w-full bg-gradient-to-r from-violet-700 to-purple-500">View Results</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
