"use client";

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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const currentDate = dayjs().toDate();
const thirtyDaysFromNow = dayjs().add(30, "day").toDate();

const formSchema = z.object({
  question: z
    .string()
    .min(1, {
      message: "A question is required",
    })
    .max(120, {
      message: "Question cannot be longer than 120 characters",
    }),
  options: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, {
            message: "Option cannot be blank",
          })
          .max(120, {
            message: "Option cannot be longer than 120 characters",
          }),
      })
    )
    .min(2, {
      message: "You must have at least two options",
    })
    .max(5, {
      message: "You cannot have more than five options",
    }),
  expiration: z.date().min(currentDate),
  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters",
    })
    .optional(),
});

export default function CreatePoll() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      options: [{ value: "" }, { value: "" }],
      expiration: thirtyDaysFromNow,
      password: undefined,
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

  // TODO
  function onSubmit(values: z.infer<typeof formSchema>) {
    // filter out empty options

    const sanitizedValues = {
      ...values,
      options: values.options.filter((option) => option.value),
    };

    console.log(sanitizedValues);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="text-2xl mb-8 font-bold">Create</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem className="mb-8">
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Input placeholder="Question" {...field} />
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
                      <Input {...field} />
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
              disabled={fields.length >= 5}
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
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormDescription>
                  This is optional. If given a password, voters will have to enter it before they
                  can vote. Leave blank if you want your poll to be public.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
}
