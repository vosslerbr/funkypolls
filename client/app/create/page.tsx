"use client";

import PageTitle from "@/components/PageTitle";
import LinksDialog from "@/components/alerts/LinksDialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Links } from "@/lib/helpers.ts/getPollAndAnswers";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { createFunkyPoll } from "../../lib/actions";
import { CreatePollFormValues, defaultValues, expirationOptions, formSchema } from "./formSetup";

// TODO continue refactor to look more like the results page
// ? this way we can set metadata
export default function CreatePoll() {
  const [showLinksDialog, setShowLinksDialog] = useState(false);
  const [links, setLinks] = useState<Links | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();
  const { user } = useUser();

  // TODO we want expiration to be based on a selected lifetime (1min, 5min, 1hr, 1day, 1week, 1month, 1year...) instead of a date
  const form = useForm<CreatePollFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "options",
    rules: {
      minLength: 2,
      maxLength: 5,
    },
  });

  async function onSubmit(values: CreatePollFormValues) {
    try {
      setSubmitting(true);

      if (!user) throw new Error("User is not logged in");

      // filter out empty options
      const sanitizedValues = {
        ...values,
        options: values.options.filter((option) => option.value),
        userId: user.id,
      };

      const links = await createFunkyPoll(sanitizedValues);

      form.reset();

      // show modal
      setLinks(links);
      setShowLinksDialog(true);
    } catch (error) {
      console.error(error);

      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error creating your FunkyPoll. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <LinksDialog links={links} open={showLinksDialog} setShowLinksDialog={setShowLinksDialog} />

      <PageTitle title="Create a FunkyPoll" />

      <div className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="mb-8">
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Question" {...field} disabled={submitting} />
                  </FormControl>
                  <FormDescription>
                    This is the question that you want to ask. It should be short and to the point.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mb-8">
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`options.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>Options</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={submitting} />
                      </FormControl>
                      <FormDescription className={cn(index !== fields.length - 1 && "sr-only")}>
                        These are the options that you want people to choose from. You can provide 2
                        to 5 options.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                disabled={fields.length >= 5 || submitting}
                onClick={() => append({ value: "" })}>
                Add Option
              </Button>
            </div>

            <FormField
              control={form.control}
              name="expiration"
              render={({ field }) => (
                <FormItem className="flex flex-col mb-8">
                  <FormLabel>Expiration</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Accept votes for..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expirationOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-8">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      disabled={submitting}
                    />
                  </FormControl>
                  <FormDescription>
                    This is optional. If given a password, voters will have to enter it before they
                    can vote. Leave blank if you want your poll to be public.
                  </FormDescription>
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
    </>
  );
}
