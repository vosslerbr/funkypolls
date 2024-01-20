"use client";

import LinksDialog from "@/components/alerts/LinksDialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Links, PollWithLinks } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { CreateQuestionFormValues, defaultValues, questionFormSchema } from "../_helpers/formSetup";

// TODO this needs to accept a Poll id from the URL so we can connect to the correct poll and prevent people from creating questions without a poll
export default function CreateForm({ poll }: { poll: PollWithLinks }) {
  const [showLinksDialog, setShowLinksDialog] = useState(false);
  const [links, setLinks] = useState<Links | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();
  const { user } = useUser();

  const form = useForm<CreateQuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
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

  async function onSubmit(values: CreateQuestionFormValues) {
    try {
      setSubmitting(true);

      if (!user) throw new Error("User is not logged in");

      // filter out empty options
      const sanitizedValues = {
        ...values,
        options: values.options.filter((option) => option.value),
      };

      console.log("submit would happen here: ", sanitizedValues);

      // const { links, passcode } = await createFunkyPoll(sanitizedValues);

      // form.reset();

      // // show modal
      // setLinks(links);
      // setPasscode(passcode);
      // setShowLinksDialog(true);
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
      <LinksDialog links={links} passcode={"N/A"} open={showLinksDialog} setShowLinksDialog={setShowLinksDialog} />

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
                        These are the options that you want people to choose from. You can provide 2 to 5 options.
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

            {/* // TODO move this to a modal when opening a Poll from the dashboard */}
            {/* <FormField
              control={form.control}
              name="expiration"
              render={({ field }) => (
                <FormItem className="flex flex-col mb-8">
                  <FormLabel>Expiration</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={submitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Accept votes for..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expirationOptions.map((option) => (
                        <SelectItem key={option.label} value={option.label}>
                          {option.label}
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
              name="requirePasscodeToView"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-8">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={submitting} />
                  </FormControl>

                  <div className="space-y-1 leading-none">
                    <FormLabel>Require passcode to access voting form</FormLabel>
                    <FormDescription>
                      Voters will be required to enter this FunkyPoll&apos;s passcode before they can access the voting
                      form.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            /> */}

            {submitting ? (
              <Button
                type="submit"
                disabled={true}
                className="sm:w-auto w-full bg-gradient-to-r from-violet-700 to-purple-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </Button>
            ) : (
              <Button type="submit" className="sm:w-auto w-full bg-gradient-to-r from-violet-700 to-purple-500">
                Submit
              </Button>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}
