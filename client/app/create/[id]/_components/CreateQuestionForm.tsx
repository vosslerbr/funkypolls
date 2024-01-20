"use client";

import CharacterCount from "@/components/CharacterCount";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createQuestion } from "@/lib/actions";
import { PollWithLinks } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { CreateQuestionFormValues, defaultValues, questionFormSchema } from "../_helpers/formSetup";

export default function CreateQuestionForm({ data: { poll } }: { data: PollWithLinks }) {
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  const { toast } = useToast();
  const { user } = useUser();

  const form = useForm<CreateQuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      ...defaultValues,
      pollId: poll.id,
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "options",
    rules: {
      minLength: 2,
      maxLength: 5,
    },
  });

  async function saveQuestion(values: CreateQuestionFormValues, addAnother = false) {
    try {
      setSaving(true);

      if (!user) throw new Error("User is not logged in");

      // filter out empty options
      const sanitizedValues = {
        ...values,
        options: values.options.filter((option) => option.value),
        userId: user.id,
      };

      const newQuestion = await createQuestion(sanitizedValues, addAnother);

      toast({
        title: "Success",
        description: `Question "${newQuestion.question}" has been created.`,
      });

      form.reset();

      // if not adding another, redirect to dashboard
      if (!addAnother) router.push("/dashboard");
    } catch (error) {
      console.error(error);

      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error creating your FunkyPoll. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function onAddAnother(values: CreateQuestionFormValues) {
    await saveQuestion(values, true);
  }

  async function onSave(values: CreateQuestionFormValues) {
    await saveQuestion(values);
  }

  return (
    <>
      <div className="mt-8">
        <h3 className="sm:text-3xl text-2xl font-bold text-gray-950">
          <span className="text-gray-400">Poll: </span>
          {poll.name}
        </h3>
      </div>

      <div className="mt-8">
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="mb-8">
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Question" {...field} disabled={saving} />
                  </FormControl>
                  <FormDescription>
                    This is the question that you want to ask. It should be short and to the point.{" "}
                    <CharacterCount currentLength={field.value.length} />
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
                        <Input {...field} disabled={saving} />
                      </FormControl>
                      <FormDescription>
                        <CharacterCount currentLength={field.value.length} />
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
                disabled={fields.length >= 5 || saving}
                onClick={() => append({ value: "" })}>
                Add Option
              </Button>
            </div>

            <Button
              type="submit"
              variant="secondary"
              disabled={!form.formState.isValid || saving}
              className="w-full mb-4 sm:w-auto sm:mb-0 sm:mr-4"
              onClick={form.handleSubmit(onAddAnother)}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save and add another
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isValid || saving}
              className="sm:w-auto w-full bg-gradient-to-r from-violet-700 to-purple-500"
              onClick={form.handleSubmit(onSave)}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
