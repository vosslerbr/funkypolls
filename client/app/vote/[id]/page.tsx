"use client";

import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
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
import { checkForPollPassword, getPollById, validatePollPassword } from "@/lib/actions";
import { PollWithOptions } from "@/lib/helpers.ts/getPollAndAnswers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PasswordFormValues, defaultValues, formSchema } from "./formSetup";

export default function Vote({ params }: { params: { id: string } }) {
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState<PollWithOptions | null>(null);
  const [validated, setValidated] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    async function fetchPoll() {
      try {
        const requiresPassword = await checkForPollPassword(id);

        console.log("requiresPassword", requiresPassword);

        if (requiresPassword) return;

        const data = await getPollById(id);

        console.log(data);

        setPoll(data.poll);

        setValidated(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPoll();
  }, [id]);

  async function onSubmit(values: PasswordFormValues) {
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
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) return <h1>Loading...</h1>;

  // todo handle poll not found

  if (!validated) {
    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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

  return (
    <>
      <PageTitle title="Vote" />
      <h2>{poll?.question}</h2>

      <ul className="mt-4">
        {poll?.options.map((option) => (
          <li key={option.id}>{option.text}</li>
        ))}
      </ul>
    </>
  );
}
