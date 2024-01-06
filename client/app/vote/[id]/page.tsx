"use client";

import { Loading } from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { checkForPollPassword, getPollById, handleVote, validatePollPassword } from "@/lib/actions";
import { PollWithOptions } from "@/lib/helpers.ts/getPollAndAnswers";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordFormValues, defaultValues, formSchema } from "./formSetup";

export default function Vote({ params }: { params: { id: string } }) {
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState<PollWithOptions | null>(null);
  const [optionIds, setOptionIds] = useState<string[]>([]);
  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showThanksDialog, setShowThanksDialog] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (id) {
      // check if user has voted
      if (localStorage.getItem(`poll-${id}`)) {
        setHasVoted(true);
      }
    }
  }, [id, poll]);

  const isExpired = poll && dayjs(poll.expirationDate).isBefore(dayjs());

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const voteFormSchema = z.object({
    optionId: z.enum(optionIds as [string, ...string[]], {
      required_error: "Please select an option",
    }),
  });

  const voteForm = useForm<z.infer<typeof voteFormSchema>>({
    resolver: zodResolver(voteFormSchema),
  });

  async function onVoteSubmit(values: z.infer<typeof voteFormSchema>) {
    try {
      setSubmitting(true);
      await handleVote(id, values.optionId);

      const data = await getPollById(id);

      setPoll(data.poll);

      localStorage.setItem(`poll-${id}`, "true");

      setShowThanksDialog(true);
    } catch (error) {
      console.error(error);

      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error saving your vote. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    async function fetchPoll() {
      try {
        const requiresPassword = await checkForPollPassword(id);

        if (requiresPassword) return;

        const data = await getPollById(id);

        setPoll(data.poll);
        setOptionIds(data.poll.options.map((option) => option.id));

        setValidated(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPoll();
  }, [id]);

  async function onPasswordSubmit(values: PasswordFormValues) {
    try {
      const { password } = values;

      const isValid = await validatePollPassword(id, password);

      setValidated(isValid);

      if (!isValid) {
        form.setError("password", {
          type: "manual",
          message: "Invalid password",
        });
      } else {
        const data = await getPollById(id);

        setPoll(data.poll);
        setOptionIds(data.poll.options.map((option) => option.id));
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <>
        <PageTitle title="Vote" />
        <Loading />
      </>
    );
  }

  // TODO handle poll not found

  // requires password and not validated
  if (!validated) {
    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onPasswordSubmit)}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-8">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please enter the password you were given to access this FunkyPoll. If you
                    don&apos;t have one, contact the creator of this poll.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </>
    );
  }

  // poll expired
  if (isExpired) {
    return (
      <>
        <PageTitle title="Vote" />
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

  // valid and not expired
  return (
    <>
      <PageTitle title="Vote" />
      <h2 className="text-2xl font-bold mt-6">{poll?.question}</h2>

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
            <Button>
              <Link href={`/results/${id}`}>View Results</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {hasVoted ? (
        <>
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>You voted in this FunkyPoll</AlertTitle>
            <AlertDescription>
              You can view the results of this FunkyPoll using the button below.
            </AlertDescription>
          </Alert>
          <Link href={`/results/${id}`} className="mt-4">
            <Button>View Results</Button>
          </Link>
        </>
      ) : (
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
              <Button type="submit" disabled={submitting}>
                Submit
              </Button>
            </form>
          </Form>
        </div>
      )}
    </>
  );
}
