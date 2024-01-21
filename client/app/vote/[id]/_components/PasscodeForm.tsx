import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { validatePollPasscode } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PasscodeFormValues, passcodeDefaultValues, passcodeFormSchema } from "../_helpers/passcodeFormSetup";

export default function PasscodeForm({
  pollId,
  setValidated,
}: {
  pollId: string;
  setValidated: (validated: boolean) => void;
}) {
  const passcodeForm = useForm<PasscodeFormValues>({
    resolver: zodResolver(passcodeFormSchema),
    defaultValues: passcodeDefaultValues,
  });

  async function onPasscodeSubmit(values: PasscodeFormValues) {
    try {
      const { passcode } = values;

      const isValid = await validatePollPasscode(pollId, passcode);

      setValidated(isValid);

      if (!isValid) {
        passcodeForm.setError("passcode", {
          type: "manual",
          message: "Invalid passcode",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold">Enter Passcode</h2>
      </CardHeader>
      <CardContent>
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
                    Please enter the passcode you were given for accessing this FunkyPoll. If you don&apos;t have one,
                    contact the creator of this poll.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="sm:w-auto w-full bg-gradient-to-r from-violet-700 to-purple-500">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
