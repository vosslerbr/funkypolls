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
import { getPollById, validatePollPassword } from "@/lib/actions";
import { PollWithOptions } from "@/lib/helpers.ts/getPollAndAnswers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PasswordFormValues, passwordDefaultValues, passwordFormSchema } from "./formSetup";

export default function PasswordForm({
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
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: passwordDefaultValues,
  });

  async function onPasswordSubmit(values: PasswordFormValues) {
    try {
      const { password } = values;

      const isValid = await validatePollPassword(id, password);

      setValidated(isValid);

      if (!isValid) {
        passwordForm.setError("password", {
          type: "manual",
          message: "Invalid password",
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
      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
          <FormField
            control={passwordForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-8">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>
                  Please enter the password you were given to access this FunkyPoll. If you
                  don&apos;t have one, contact the creator of this poll.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
