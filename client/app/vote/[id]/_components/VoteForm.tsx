import { Loading } from "@/components/Loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { handleVote } from "@/lib/actions";
import { PollWithOptions } from "@/lib/helpers.ts/getPollAndAnswers";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateVoteFormSchema } from "../_helpers/formSetup";

export default function VoteForm({
  id,
  poll,
  optionIds,
}: {
  id: string;
  poll: PollWithOptions;
  optionIds: string[];
}) {
  const [checkingLocalStorage, setCheckingLocalStorage] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showThanksDialog, setShowThanksDialog] = useState(false);

  const voteFormSchema = generateVoteFormSchema(optionIds);

  const voteForm = useForm<z.infer<typeof voteFormSchema>>({
    resolver: zodResolver(voteFormSchema),
  });

  async function onVoteSubmit(values: z.infer<typeof voteFormSchema>) {
    try {
      setSubmitting(true);
      await handleVote({ pollId: id, optionId: values.optionId, passcode: values.passcode });

      localStorage.setItem(`fp${id}`, "true");
      setHasVoted(true);

      setShowThanksDialog(true);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "There was an error saving your vote. Please try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an error saving your vote. Please try again.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    // check if user has voted
    if (localStorage.getItem(`fp${id}`)) {
      setHasVoted(true);
    }

    setCheckingLocalStorage(false);
  }, [id]);

  if (checkingLocalStorage) {
    return <Loading />;
  }

  return (
    <>
      <Dialog
        open={showThanksDialog}
        onOpenChange={(open) => {
          setShowThanksDialog(open);
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thanks!</DialogTitle>
            <DialogDescription>Your vote has been recorded</DialogDescription>
          </DialogHeader>
          <p>You can view the results of this FunkyPoll using the button below.</p>
          <DialogFooter>
            <Button className="bg-gradient-to-r from-violet-700 to-purple-500">
              <Link href={`/results/${id}`}>View Results</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {hasVoted ? (
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-2xl font-bold">{poll?.question}</h2>
          </CardHeader>
          <CardContent>
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>You voted in this FunkyPoll</AlertTitle>
              <AlertDescription>
                You can view the results of this FunkyPoll using the button below.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Link href={`/results/${id}`} className="mt-4">
              <Button className="sm:w-auto w-full bg-gradient-to-r from-violet-700 to-purple-500">
                View Results
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-2xl font-bold">{poll?.question}</h2>
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              <Form {...voteForm}>
                <form onSubmit={voteForm.handleSubmit(onVoteSubmit)}>
                  <FormField
                    control={voteForm.control}
                    name="optionId"
                    render={({ field }) => (
                      <FormItem className="space-y-3 mb-8">
                        <FormLabel>My vote:</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1">
                            {poll?.options.map((option) => (
                              <FormItem
                                className="flex items-center space-x-3 space-y-0"
                                key={option.id}>
                                <FormControl>
                                  <RadioGroupItem value={option.id} />
                                </FormControl>
                                <FormLabel className="font-normal">{option.text}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={voteForm.control}
                    name="passcode"
                    render={({ field }) => (
                      <FormItem className="mb-8">
                        <FormLabel>Passcode</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Please enter the passcode you were given for this FunkyPoll. If you
                          don&apos;t have one, contact the creator of this poll.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {submitting ? (
                    <Button
                      type="submit"
                      disabled={true}
                      className="sm:w-auto w-full bg-gradient-to-r from-violet-700 to-purple-500">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving your vote...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="sm:w-auto w-full bg-gradient-to-r from-violet-700 to-purple-500">
                      Submit
                    </Button>
                  )}
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
