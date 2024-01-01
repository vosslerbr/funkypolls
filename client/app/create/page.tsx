"use client";

import PageTitle from "@/components/PageTitle";
import LinksDialog from "@/components/alerts/LinksDialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { Links } from "@/lib/helpers.ts/getPollAndAnswers";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { createFunkyPoll } from "../../lib/actions";
import { CreatePollFormValues, currentDate, defaultValues, formSchema } from "./formSetup";

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
    <main className="flex min-h-screen flex-col   p-24">
      <LinksDialog links={links} open={showLinksDialog} setShowLinksDialog={setShowLinksDialog} />

      <PageTitle title="Create a FunkyPoll" />
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
              // TODO idk how to limit this to 5 options max
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
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        disabled={submitting}
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !field && "text-muted-foreground"
                        )}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date <= currentDate}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>

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
                  <Input type="password" placeholder="Password" {...field} disabled={submitting} />
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
    </main>
  );
}
