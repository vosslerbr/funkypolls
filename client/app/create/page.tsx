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
import { CalendarIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const currentDate = new Date();

const formSchema = z.object({
  question: z.string().min(1, {
    message: "A question is required",
  }),
  options: z
    .array(
      z.object({
        value: z.string().min(1, {
          message: "Option cannot be blank",
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
  password: z.string().nullable(),
});

export default function CreatePoll() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      options: [],
      expiration: currentDate,
      password: null,
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("hello");
    console.log(values);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <p>CREATE PAGE</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
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
          <div>
            {fields.map((field, index) => (
              // TODO idk how to limit this to 5 options max
              <FormField
                control={form.control}
                key={field.id}
                name={`options.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      Option {index + 1}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
              onClick={() => append({ value: "" })}>
              Add Option
            </Button>
          </div>

          <FormField
            control={form.control}
            name="expiration"
            render={({ field }) => (
              <FormItem className="flex flex-col">
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

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
}
