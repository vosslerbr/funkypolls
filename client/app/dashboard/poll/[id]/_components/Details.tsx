"use client";

import CopyButton from "@/components/CopyButton";
import { Loading } from "@/components/Loading";
import PollStatus from "@/components/PollStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { deletePoll, openPoll } from "@/lib/actions";
import expirationMap from "@/lib/maps/expirationMap";
import { PollWithLinks } from "@/lib/types";
import { formatExpirationDate } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Expiration, Status } from "@prisma/client";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { CalendarClock, DoorOpen, HelpCircle, KeyRound, PencilLine, Settings2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { OpenPollFormValues, defaultValues, openPollFormSchema } from "../_helpers/openPollFormSetup";

export default function Details({ data }: { data: PollWithLinks }) {
  const { user, isLoaded } = useUser();

  const router = useRouter();

  const form = useForm<OpenPollFormValues>({ resolver: zodResolver(openPollFormSchema), defaultValues });

  async function handleDeleteClick() {
    try {
      await deletePoll({
        pollId: data.poll.id,
        userId: user?.id || "",
      });

      // redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleOpenPollSubmit() {
    try {
      await openPoll({
        pollId: data.poll.id,
        userId: user?.id || "",
        requirePasscode: false,
        expiration: Expiration.TEN_MINUTES,
      });
    } catch (error) {
      console.error(error);
    }
  }

  if (!isLoaded) return <Loading />;

  if (user?.id !== data.poll.userId) return <h1>You are not authorized to view this page.</h1>;

  return (
    <>
      <div className="mb-8 flex flex-row gap-4">
        {data.poll.status === Status.OPEN && (
          <p>
            This poll is <PollStatus status="OPEN" />, so it cannot currently be changed.
          </p>
        )}

        {data.poll.status === Status.DRAFT && (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600 w-full">
                  Open Poll
                  <DoorOpen className="h-4 w-4 ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Open Poll</DialogTitle>
                  <DialogDescription>
                    Opening this FunkyPoll will allow voting to begin. Please fill out the details below to proceed.
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form className="mt-4">
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
                              {Object.entries(expirationMap.clientToDb).map(([key, value]) => (
                                <SelectItem key={key} value={value}>
                                  {key}
                                </SelectItem>
                              ))}
                            </SelectContent>
                            <FormDescription>This is how long your FunkyPoll will be open for voting.</FormDescription>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requirePasscode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-8">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>

                          <div className="space-y-1 leading-none">
                            <FormLabel>Require passcode to access voting form</FormLabel>
                            <FormDescription>
                              Voters will be required to enter this FunkyPoll&apos;s passcode before they can access the
                              voting form.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button className="bg-gradient-to-r from-violet-700 to-purple-500" onClick={handleOpenPollSubmit}>
                    Open Poll
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button className="bg-blue-500 hover:bg-blue-600  w-full">
              Edit Poll <PencilLine className="h-4 w-4 ml-2" />
            </Button>
          </>
        )}

        {data.poll.status !== Status.OPEN && (
          <Button className="bg-rose-500 hover:bg-rose-600  w-full" onClick={handleDeleteClick}>
            Delete Poll <Trash2 className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">About this FunkyPoll</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-4">
            <Card className="col-span-12 sm:col-span-6 lg:col-span-4">
              <CardHeader>
                <CardTitle>
                  <div className="flex flex-row justify-between">
                    Questions <HelpCircle className="w-6 h-6 text-slate-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{data.poll.questions.length}</p>
              </CardContent>
            </Card>
            <Card className="col-span-12 sm:col-span-6 lg:col-span-4">
              <CardHeader>
                <CardTitle>
                  <div className="flex flex-row justify-between">
                    Passcode <KeyRound className="w-6 h-6 text-slate-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CopyButton copyTitle={data.poll.passcode} copyData={data.poll.passcode} />
              </CardContent>
            </Card>
            <Card className="col-span-12 sm:col-span-6 lg:col-span-4">
              <CardHeader>
                <CardTitle>
                  <div className="flex flex-row justify-between">
                    Status <Settings2 className="w-6 h-6 text-slate-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PollStatus status={data.poll.status} />
              </CardContent>
            </Card>
            <Card className="col-span-12 sm:col-span-6 lg:col-span-4">
              <CardHeader>
                <CardTitle>
                  <div className="flex flex-row justify-between">
                    Open For <DoorOpen className="w-6 h-6 text-slate-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{expirationMap.dbToClient[data.poll.expiration]}</p>
              </CardContent>
            </Card>

            {data.poll.status === Status.OPEN && (
              <Card className="col-span-12 sm:col-span-6 lg:col-span-4">
                <CardHeader>
                  <CardTitle>
                    <div className="flex flex-row justify-between">
                      Expiration Date <CalendarClock className="w-6 h-6 text-slate-400" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{formatExpirationDate(data.poll.expirationDate, data.poll.status)}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {data.poll.questions.map((question) => {
        return (
          <Card className="mt-8" key={question.id}>
            <CardHeader>
              <h2 className="text-2xl font-bold">{question.question}</h2>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl text-slate-500">Options</h3>
              {question.options.map((option, index) => {
                const isLastOption = index === question.options.length - 1;

                if (isLastOption) {
                  return (
                    <div className="flex flex-col mt-4" key={option.id}>
                      <p className="mr-2">{option.text}</p>
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col my-4" key={option.id}>
                    <p className="mr-2 mb-4">{option.text}</p>
                    <Separator />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
