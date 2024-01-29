import PollStatus from "@/components/PollStatus";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { deletePoll, openPoll } from "@/lib/actions";
import expirationMap from "@/lib/maps/expirationMap";
import { PollWithLinks } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Expiration, Status } from "@prisma/client";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { DoorOpen, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { OpenPollFormValues, defaultValues, openPollFormSchema } from "../_helpers/openPollFormSetup";

export default function PollActions({ data: { poll } }: { data: PollWithLinks }) {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const { toast } = useToast();

  const form = useForm<OpenPollFormValues>({ resolver: zodResolver(openPollFormSchema), defaultValues });

  async function handleOpenPollSubmit(values: OpenPollFormValues) {
    try {
      await openPoll({
        pollId: poll.id,
        userId: user?.id || "",
        requirePasscode: values.requirePasscode,
        expiration: values.expiration as Expiration,
      });

      toast({
        title: "Success",
        description: (
          <>
            {poll.name} is now {<PollStatus status="OPEN" />}.
          </>
        ),
      });
    } catch (error) {
      console.error(error);

      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error opening your FunkyPoll. Please try again.",
      });
    }
  }

  async function handleDeleteClick() {
    try {
      await deletePoll({
        pollId: poll.id,
        userId: user?.id || "",
      });

      toast({
        title: "Success",
        description: <>{poll.name} has been deleted.</>,
      });

      // redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error deleting your FunkyPoll. Please try again.",
      });
    }
  }

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div className="mb-8 flex flex-row gap-4">
      {/* don't allow any changes to OPEN polls */}
      {poll.status === Status.OPEN && (
        <p>
          This poll is <PollStatus status="OPEN" />, so it cannot currently be changed.
        </p>
      )}

      {/* only DRAFT can be edited or opened */}
      {poll.status === Status.DRAFT && (
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
                <Button
                  className="bg-gradient-to-r from-violet-700 to-purple-500"
                  onClick={form.handleSubmit(handleOpenPollSubmit)}>
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

      {/* for any status that's not OPEN, poll can be deleted */}
      {poll.status !== Status.OPEN && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-rose-500 hover:bg-rose-600 w-full">
              Delete Poll <Trash2 className="h-4 w-4 ml-2" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Heads Up!</AlertDialogTitle>
            </AlertDialogHeader>
            You&apos;re about to delete this FunkyPoll. This action cannot be undone.
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="secondary">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button className="bg-gradient-to-r from-violet-700 to-purple-500" onClick={handleDeleteClick}>
                  Delete Poll
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
