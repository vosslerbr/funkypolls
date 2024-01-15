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
import { getPollById, validatePollPasscode } from "@/lib/actions";
import { PollWithOptions } from "@/lib/helpers.ts/getPollAndAnswers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  PasscodeFormValues,
  passcodeDefaultValues,
  passcodeFormSchema,
} from "../_helpers/formSetup";

export default function PasscodeForm({
  id,
  setPoll,
  setOptionIds,
  setValidated,
}: {
  id: string;
  setPoll: (poll: PollWithOptions) => void;
  setOptionIds: (ids: string[]) => void;
  setValidated: (validated: boolean) => void;
}) {
  const passcodeForm = useForm<PasscodeFormValues>({
    resolver: zodResolver(passcodeFormSchema),
    defaultValues: passcodeDefaultValues,
  });

  async function onPasscodeSubmit(values: PasscodeFormValues) {
    try {
      const { passcode } = values;

      const isValid = await validatePollPasscode(id, passcode);

      setValidated(isValid);

      if (!isValid) {
        passcodeForm.setError("passcode", {
          type: "manual",
          message: "Invalid passcode",
        });
      } else {
        const data = await getPollById(id);

        setPoll(data.poll);
        setOptionIds(data.poll.options.map((option) => option.id));
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="mt-6">
      <Form {...passcodeForm}>
        <form onSubmit={passcodeForm.handleSubmit(onPasscodeSubmit)}>
          <FormField
            control={passcodeForm.control}
            name="passcode"
            render={({ field }) => (
              <FormItem className="mb-8">
                <FormLabel>Passcode</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>
                  Please enter the passcode you were given to access this FunkyPoll. If you
                  don&apos;t have one, contact the creator of this poll.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="sm:w-auto w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
