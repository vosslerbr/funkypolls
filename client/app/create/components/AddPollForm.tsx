"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createFunkyPoll } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreatePollFormValues, defaultValues, pollFormSchema } from "../helpers/pollFormSetup";

export default function AddPollForm() {
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  const { toast } = useToast();
  const { user } = useUser();

  const form = useForm<CreatePollFormValues>({ resolver: zodResolver(pollFormSchema), defaultValues });

  async function onSubmit(values: CreatePollFormValues) {
    try {
      setSaving(true);

      if (!user) throw new Error("User is not logged in");

      const finalValues = {
        ...values,
        userId: user.id,
      };

      const pollId = await createFunkyPoll(finalValues);

      toast({
        title: "Success",
        description: "Your FunkyPoll has been created.",
      });

      router.push(`/create/${pollId}`);
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

  return (
    <>
      <div className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-8">
                  <FormLabel>Name your FunkyPoll</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} disabled={saving} />
                  </FormControl>
                  <FormDescription>
                    This is the the name of your FunkyPoll. It should describe what types of questions you will be
                    asking, or can just be a way to identify your FunkyPoll.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* // TODO need better saving state here */}
            {saving ? (
              <Button
                type="submit"
                disabled={true}
                className="sm:w-auto w-full bg-gradient-to-r from-violet-700 to-purple-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </Button>
            ) : (
              <>
                {/* // TODO how do we handle different submit types? */}
                <Button type="submit" variant="secondary" className="w-full mb-4 sm:w-auto sm:mb-0 sm:mr-4">
                  Save as Draft
                </Button>
                <Button type="submit" className="sm:w-auto w-full bg-gradient-to-r from-violet-700 to-purple-500">
                  Add Questions
                </Button>
              </>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}
